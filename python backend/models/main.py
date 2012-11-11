import sha

from sqlalchemy import create_engine, Sequence, Table, Column, ForeignKey, DateTime, Enum, Boolean, Integer, Integer, String, Text
from sqlalchemy.orm import relationship, backref, scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import Comparator, hybrid_property, hybrid_method
from sqlalchemy.sql.expression import func

Base = declarative_base()
DB_ECHO = False

class JSONSerializable:
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
    __tablename__ = 'device'

    id = Column(Integer, primary_key=True)
    type = Column(String(40))
    description = Column(Text)
    device_id = Column(String(40), unique=True)
    current_val = Column(String(40))
    last_update = Column(DateTime)
    added_on = Column(DateTime, default=func.now())
    data = relationship("Log")

    def __init__(self, type, description, device_id):
        self.type = type
        self.description = description
        self.device_id = device_id

    def __repr__(self):
        return "<Device(id:%s, type:%s, device_id:%s, added on:%s)>" % (str(self.id), self.type, self.device_id, str(self.added_on))

    def add_value(self, value):
        log_row = Log(value, self.id)

        self.last_update = log_row.timestamp
        self.current_val = value

        session = Backend.instance().get_session()
        session.add(log_row)
        session.commit()
        session.close()

    def get_values(self, n):
    #returns last n values
        session = Backend.instance().get_session()
        session.query

    def json(self):
        return {
            'id':self.id,
            'type':self.type,
            'description': self.description,
            'device_id':self.device_id,
            'current_val':self.current_val,
            'last_update':str(self.last_update),
            'added_on':str(self.added_on)
        }


##############################################################################
# Table 2
#   Name: log_table
#   Fields
#   id: unique db_id
#   device_id: foreign key to the above table
#   timestamp: time stamp of this value
#   value: value of the device 
##############################################################################
class Log(Base, JSONSerializable):
    __tablename__ = 'log'

    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, ForeignKey('device.id'))
    timestamp = Column(DateTime, default = func.now())
    value = Column(String(40))


    def __init__(self, value, device_id):
        self.device_id = device_id
        self.value = value

    def __repr__(self):
        return "<Log(id:%s, device_id:%s, value:%s, timestamp%s)>" % (str(self.id),str(device_id), value, str(timestamp))
        
    def json(self):
        return {
            'id':self.id,
            'device_id':str(self.device_id),
            'timestamp':str(self.timestamp),
            'value': self.value
        }

    def val_json(self):
        return {
            'value':self.value,
            'timestamp':self.timestamp
        }

class Backend(object):
    def __init__(self):
        global DB_ECHO
        engine = create_engine('mysql://etho_g:pass@127.0.0.1:3306/etho_db', echo=DB_ECHO, pool_recycle=3600)
        self._session = sessionmaker(bind=engine)

    @classmethod
    def instance(cls):
        if not hasattr(cls, "_instance"):
            cls._instance = cls()
        return cls._instance

    def get_session(self):
        return self._session()

metadata = Base.metadata
def create_all():
    engine = create_engine('mysql://etho_g:pass@127.0.0.1:3306/etho_db', echo=False, pool_recycle=3600)
    metadata.create_all(engine)