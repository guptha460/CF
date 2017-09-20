from flask import Flask
import os
import psycopg2
import json

app = Flask(__name__)

# Get port from environment variable or choose 9099 as local default

port = int(os.getenv('PORT', 9099))

# Get Redis credentials

if 'VCAP_SERVICES' in os.environ:
    services = json.loads(os.getenv('VCAP_SERVICES'))

    # VCAP_SERVICES.postgresql[0].credentials.uri

    redis_env =  psycopg2.connect(services['postgresql'][0]['credentials']['uri'])

 
else:
    redis_env = psycopg2.connect(database='CF', user='postgres',
                                 password='Welcome123', host='127.0.0.1',
                                 port='5432')



@app.route('/')
def hello_world():
    cur = redis_env.cursor()
    cur.execute("""SELECT datname from pg_database""")
    val = 'xxzc'
    rows = cur.fetchall()
    for row in rows:
        val = row[0]
        redis_env.close()
    return val

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
