from sqlalchemy import create_engine, Sequence, Table, Column, ForeignKey, DateTime, Enum, Boolean, Integer, Integer, String, Text
from sqlalchemy.orm import relationship, backref, scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import Comparator, hybrid_property, hybrid_method
from sqlalchemy.sql.expression import func

import logging

Base = declarative_base()
DB_ECHO = False

class JSONSerializable:
    '''just for safety, although the only two tables in this file has the json function defined'''
    def json(self):
        raise NotImplementedError


#############################################################################
# Table 1:
#   Name: device_table
#   Fields:
#   1.id: Unique db_id
#   2.type: type of sensor / light / blah blah
#       Determines arduino, lighting controller, HVAC, etc.
#       Determines type within that device
#   3.descp: short device descp
#   4.dev_id: unique id to differentiate between device of same type MAC address / lighting controller ID
#   5.curr_val: current value of the device
#   6.last_update: last modification time
#   7.added_on: when was it added?
##############################################################################
class Device(Base, JSONSerializable):
    '''defines the table  mapping for the devices table'''
    __tablename__ = 'device'

    id = Column(Integer, primary_key=True)
    type = Column(String(40))
    description = Column(Text)
    hardware_id = Column(String(40), unique=True)
    current_val = Column(String(40))
    last_update = Column(DateTime)
    added_on = Column(DateTime, default=func.now())
    data = relationship("Log")

    def __init__(self, type, description, hardware_id):
        '''initialize the current row with certain set of values, specifically the type, description and device id'''
        self.type = type
        self.description = description
        self.hardware_id = hardware_id

    def __repr__(self):
        return "<Device(id:%s, type:%s, hardware_id:%s, added on:%s)>" % (str(self.id), self.type, self.hardware_id, str(self.added_on))

    def add_value(self, value):
        '''adds the passed in value to the associated device's log this way there is no need for us to even touch the log table'''

        #sanity check
        value = str(value)

        #if self is not assigned id yet then this can generate exception
        try:
            log_row = Log(value, self.id)
        except:
            logging.error("The id is probably not defined for the current element")
            return False

        self.last_update = log_row.timestamp
        self.current_val = value

        session = Backend.instance().get_session()
        session.add(log_row)
        session.commit()
        session.close()
        return True

    def add_values(self, values):
        ''' same function as add_value just the difference is that you can add multiple values using this function'''
        #this function can be optimized, currently each values is inserted individually SQLAlchemy API supports inserting many at a time
        #sanity check
        if type(values) != list:
            return False
        for each in values:
            if not self.add_value(each):
                return False
        return True

    def get_values(self, page=0):
        '''the function is used to paginate the data from the log table of the relevant device
        page is the page number of the values you want returns the value of page 0 by default'''
        #we could define set of default values per page for each deivce based on the device
        if page < 0: return []
        values_per_page = 4
        all_values = self.get_all_values()

        start = page*values_per_page

        #sanity check to make sure that page values don't go over what is there in the store
        if (page+1)*values_per_page > len(all_values):
            if (page)*values_per_page > len(all_values):
                return []
            else:
                end = start+(len(all_values)%values_per_page)
        else:
            end = start+values_per_page

        print start,end, len(all_values), page
        ret_vals = []

        for each in range(start,end):
            ret_vals.append(all_values[each].val_json())

        return ret_vals

    def get_all_values(self):
        #query the db to get all the values
        session = Backend.instance().get_session()
        try:
            query = session.query(Log).filter(Log.hardware_id == self.id)
            values = query.all()
        except:
            return []
        return values

    def json(self):
        '''just a json wrapper function for the table row'''
        return {
            'id':self.id,
            'type':self.type,
            'description': self.description,
            'hardware_id':self.hardware_id,
            'current_val':self.current_val,
            'last_update':str(self.last_update),
            'added_on':str(self.added_on)
        }


##############################################################################
# Table 2
#   Name: log_table
#   Fields
#   id: unique db_id
#   hardware_id: foreign key to the above table
#   timestamp: time stamp of this value
#   value: value of the device
##############################################################################
class Log(Base, JSONSerializable):
    __tablename__ = 'log'

    id = Column(Integer, primary_key=True)
    hardware_id = Column(Integer, ForeignKey('device.id'))
    timestamp = Column(DateTime, default = func.now())
    value = Column(String(40))


    def __init__(self, value, hardware_id):
        '''initialize the row in log table with value and device id'''
        #never expect the user to directly call this function, the add_value function in devices class should be the only place this is called from
        self.hardware_id = hardware_id
        self.value = value

    def __repr__(self):
        return "<Log(id:%s, hardware_id:%s, value:%s, timestamp%s)>" % (str(self.id),str(self.hardware_id), self.value, str(self.timestamp))

    def json(self):
        return {
            'id':self.id,
            'hardware_id':str(self.hardware_id),
            'timestamp':str(self.timestamp),
            'value': self.value
        }

    def val_json(self):
        '''custom json wrapper that just returns the value and timestamp in dict format'''
        return {
            'value':self.value,
            'timestamp':self.timestamp
        }

class Backend(object):
    ''' this class takes care of the the SQLAlchemy overhead to talk with the data base'''
    def __init__(self):
        global DB_ECHO
        engine = create_engine('mysql://etho_g:pass@127.0.0.1:3306/etho_db', echo=DB_ECHO, pool_recycle=3600)
        self._session = sessionmaker(bind=engine)

    @classmethod
    def instance(cls):
        '''call this function to get an instance of this class, have many instances lying around is not a good idea'''
        if not hasattr(cls, "_instance"):
            cls._instance = cls()
        return cls._instance

    def get_session(self):
        '''returns the active session of the engine'''
        return self._session()

metadata = Base.metadata
def create_all():
    '''call this only once in the starting to create the tables in the database'''
    engine = create_engine('mysql://etho_g:pass@127.0.0.1:3306/etho_db', echo=False, pool_recycle=3600)
    metadata.create_all(engine)