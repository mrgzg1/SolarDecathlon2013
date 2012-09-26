import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.httpclient
import tornado.web
import urllib
import json
import time
import site

import os
import logging

from tornado.escape import json_encode, json_decode, xhtml_escape
from tornadio2 import SocketConnection, TornadioRouter, SocketServer, event, gen

from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)
define("address", default="0.0.0.0", help="run on the given port", type=int)
define("miniserver_address", default="0.0.0.0", help="this is the port where the miniserver is running", type=int)
define("debug", default=0, help="setdebug option 0= false, 1 = true(default)", type=int)

# site.addsitedir adds this directory to sys.path then scans for .pth files
# and adds them to the path too.
base_dir = os.path.dirname(os.path.abspath(__file__))
site.addsitedir(os.path.join(base_dir, 'third_party'))

#variable that holds on to all the live connections
global socketServer

class SocketIOHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('../socket.io.js')

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

class ToggleSample(tornado.web.RequestHandler):
    def get(self):
        client = tornado.httpclient.HTTPClient()
        req = tornado.httpclient.HTTPRequest('http://admin:admin@'+options.miniserver_address+'/dev/sps/io/Pushbutton%20Living%20Room/On',method="GET")
        response = client.fetch(req)
        logging.error(response)
        time.sleep(0.05)
        req = tornado.httpclient.HTTPRequest('http://admin:admin@'+options.miniserver_address+'/dev/sps/io/Pushbutton%20Living%20Room/Off',method="GET")
        response = client.fetch(req)  
        logging.error(response)
        self.write(str(response))

class EchoHandler(tornado.web.RequestHandler):
    def get(self):
        text = self.get_argument('text')
        global socketServer
        SocketIO_middleware(text)
        logging.error(text)

def SocketIO_middleware(data):
    global live_clients
    for each in live_clients:
        each.emit('echo',data)


class RootSocketConnection(SocketConnection):
    global live_clients
    live_clients = []  #list that maintains list of live users
    def on_open(self, data):
        global live_clients
        logging.error('Root Socket Opened')
        live_clients.append(self)

    def on_close(self):
        global live_clients
        logging.error('Root Socket Closed')
        #live_clients.remove(self)

    @event('event_1')
    def event_1_handler(self, arg1, arg2):
        self.emit('return_event', arg1, arg2)


class Application(tornado.web.Application):
    def __init__(self, debug_):
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            login_url="/auth/login",
            debug=debug_,
            socket_io_port = options.port,
            enabled_protocols=['websocket', 'xhr-multipart', 'xhr-polling'],
        )
        handlers = [
            (r"/", IndexHandler),
            (r"/toggleSample", ToggleSample),
            (r"/echo", EchoHandler),


            (r"/socket.io.js", SocketIOHandler),
        ]
        global socketServer
        socketServer = TornadioRouter(RootSocketConnection, settings)
        handlers.extend(socketServer.urls)
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    tornado.options.parse_command_line()

    app = Application(bool(options.debug))
    app.listen(options.port, options.address)
    #SocketServer(app)

    ioloop = tornado.ioloop.IOLoop.instance()
    ioloop.start()

if __name__ == "__main__":
    main()