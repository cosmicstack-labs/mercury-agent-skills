#!/usr/bin/env python3
import base64, os
b64 = "LyogTWVyY3VyeSBTa2lsbCBMaWJyYXJ5IHYyLjAg4oCUIERldmVsb3BlZCBieSBNZXJjdXJ5IMK3IFBvd2VyZWQgYnkgQ29zbWljIFN0YWNrICovCmxldCBza2lsbHM9W10sY2F0ZWdvcmllcz17fSxtYXJrZWRSZWFkeT1mYWxzZSxjdXJyZW50Vmlldz0naG9tZScsY3VycmVudFNraWxsSWQ9bnVsbDsKZnVuY3Rpb24gZ2IoKXtyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWVyY3VyeS1ib29rbWFya3MnKXx8J1tdJyl9CmZ1bmN0aW9uIGdsKCl7cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21lcmN1cnktbGlrZXMnKXx8J1tdJyl9"
data = base64.b64decode(b64).decode('utf-8')
with open(os.path.join(os.path.dirname(__file__), 'app.js'), 'w') as f:
    f.write('[PLACEHOLDER]')
print("ok")
