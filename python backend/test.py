from models.main import *

b = Backend() #init backend
session = Backend.instance().get_session()
dev1 = Device('type1','descp1','uniqueID1')
dev2 = Device('type2','descp2','uniqueID2')
session.add_all([dev1, dev2])
session.commit()
session.close()