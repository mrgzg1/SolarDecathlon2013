import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.httpclient
import tornado.web
import urllib
import json
import time


import os
import logging

from tornado.escape import json_encode, json_decode, xhtml_escape
from tornadio2 import SocketConnection, TornadioRouter, SocketServer, event, gen

from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)
define("address", default="0.0.0.0", help="run on the given port", type=int)
define("debug", default=0, help="setdebug option 0= false, 1 = true(default)", type=int)

class SocketIOHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('./socket.io.js')

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

class ToggleSample(tornado.web.RequestHandler):
    def get(self):
        client = tornado.httpclient.HTTPClient()
        req = tornado.httpclient.HTTPRequest('http://admin:admin@192.168.88.102/dev/sps/io/Pushbutton%20Living%20Room/On',method="GET")
        response = client.fetch(req)
        logging.error(response)
        time.sleep(0.05)
        req = tornado.httpclient.HTTPRequest('http://admin:admin@192.168.88.102/dev/sps/io/Pushbutton%20Living%20Room/Off',method="GET")
        response = client.fetch(req)  
        logging.error(response)
        self.write(str(response))

class EchoHandler(tornado.web.RequestHandler):
    def get(self):
        text = self.get_argument('text')
        logging.error(text)

class MultiplexedSocket(SocketConnection):
    def on_open(self):
        pass

    def on_close(self):
        pass

    @event('event_1')
    def event_1_handler(self, arg1, arg2):
        self.emit('return_event', arg1, arg2)

class RootSocketConnection(SocketConnection):
    #authentication works in multiplexed connection
    #to authenticated pass the cookie data to the 'auth_user' function in SocketMixin
    __endpoints__ = {   '/events' : MultiplexedSocket,
                    }
    def on_open(self, data):
        pass

    def on_close(self):
        pass

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
        #TODO: seperate out all the handlers to all the files and aggregate them here.
        handlers = [
            (r"/", IndexHandler),
            (r"/toggleSample", ToggleSample),
            (r"/echo", EchoHandler),


            (r"/socket.io.js", SocketIOHandler),
        ]
        #change to Root Socket handler once multiplexed auth is determined
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