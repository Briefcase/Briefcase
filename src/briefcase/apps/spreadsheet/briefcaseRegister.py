
from briefcase import core

core.module.register("Spreadsheet", "briefcase.apps.spreadsheet.views.new", r'^spreadsheet/', 'briefcase.apps.spreadsheet.urls')

import events  # the locoal copy of this application's event

core.sockets.register("Spreadsheet", events.onConnect, events.onMessage, events.onDisconnect)
