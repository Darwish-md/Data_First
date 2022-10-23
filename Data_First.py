# pylint: disable=no-member  
# pylint: disable=import-error

from calendar import month
from operator import ne
from typing import final
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json
import sqlite3
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta

def conn_db():
    conn = None
    try:
        conn = sqlite3.connect('antavo-database/antavo-db')
    except:
        print("Couldn't connect to db")

    return conn
def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response

    @app.route("/top_product_yearly", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def top_product_yearly():
        conn = conn_db()
        cur = conn.cursor()
        year = request.args.get('year')
        print(year)
        start_date = datetime.fromisoformat(f'{year}-01-01 00:00:00')
        end_date = start_date + relativedelta(months=+12)
        query = ''.join(['SELECT DISTINCT "properties.product_id" as product, "properties.total" as price, COUNT(*) as quantity , "properties.total" * COUNT(*)  AS profit '
                    ,' FROM events_junction '
                    ,' where action = "checkout_item" '
                    ,' AND "properties.total" <> 0 '
                    ,f' AND timestamp between "{start_date}" AND "{end_date}" '
		    		,' group by "properties.product_id" '
		    		,' order by quantity desc; '])
        cur.execute(query)
        data_per_year = cur.fetchall()
        conn.close()

        return jsonify({
            'success': True,
            'data': data_per_year
        })

    @app.route("/top_product_monthly", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def top_product_monthly():
        conn = conn_db()
        cur = conn.cursor()
        year = request.args.get('year')
        print(year)
        current_month = datetime.fromisoformat(f'{year}-01-01 00:00:00')
        print(f"currenjt: {current_month}")
        data_per_year = []
        
        for i in range(11):
            next_month = current_month + relativedelta(months=+1)
            print(f"currenjt: {current_month}")
            print(f"next: {next_month}")
            query = ''.join(['SELECT DISTINCT "properties.product_id" as product, "properties.total" as price, COUNT(*) as quantity , "properties.total" * COUNT(*)  AS profit '
                    ,' FROM events_junction '
                    ,' where action = "checkout_item" '
                    ,' AND "properties.total" <> 0 '
                    ,f' AND timestamp between "{current_month}" AND "{next_month}" '
		    		,' group by "properties.product_id" '
		    		,' order by quantity desc; '])
            print(query)
            cur.execute(query)
            data_monthly = cur.fetchall()
            prod_id = data_monthly[0]
            price = data_monthly[1]
            count = data_monthly[2]
            total_revenue = data_monthly[3]
            data_monthly_obj =  [data_monthly]
            data_per_year.append(data_monthly_obj)
            current_month = current_month + relativedelta(months=+1)
        conn.close()

        return jsonify({
            'success': True,
            'data': data_per_year
        })

    @app.route("/top_product_try", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def top_product_try():
        conn = conn_db()
        cur = conn.cursor()
        cur.execute('SELECT * from activities_junction;')
        data_monthly = cur.fetchall()

        conn.close()
        print(data_monthly[0])
        return jsonify({
            'success': True,
            'data_monthly': data_monthly[0]
        })
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "Bad request :("
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 404,
            "message": "Sorry, couldn't find a resource matching your request :("
        }), 404

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "Sorry, couldn't process your request :("
        }), 422

    @app.errorhandler(500)
    def not_allowed(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "Method not allowed"
        }), 500

    return app