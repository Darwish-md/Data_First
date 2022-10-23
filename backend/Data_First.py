# pylint: disable=no-member  
# pylint: disable=import-error

from calendar import month
from operator import ne
from typing import final
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
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

def send_query_counts(year, action):
    conn = conn_db()
    cur = conn.cursor()
    current_month = datetime.fromisoformat(f'{year}-01-01 00:00:00')
    count_per_month_arr = []

    for i in range(12):
        next_month = current_month + relativedelta(months=+1)
        cur.execute(''.join(['SELECT count(*) '
                            ,' from events_junction '
                            ,f' where action = "{action}" '
                            ,f' AND timestamp BETWEEN "{current_month}" and "{next_month}"; ']))
        count_monthly = cur.fetchall()
        print(count_monthly)
        count_per_month_arr.append(count_monthly)
        current_month = current_month + relativedelta(months=+1)

    conn.close()
    return count_per_month_arr

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
        current_month = datetime.fromisoformat(f'{year}-01-01 00:00:00')
        data_per_year = []
        
        for i in range(12):
            next_month = current_month + relativedelta(months=+1)
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

    @app.route("/get_monthly_optout", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def get_monthly_optout():
        year = request.args.get('year')
        optout_count_monthly_arr = send_query_counts(year, action="opt_out")

        return jsonify({
            'success': True,
            'data': optout_count_monthly_arr
        })
    
    @app.route("/get_monthly_optin", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def get_monthly_optin():
        year = request.args.get('year')
        optin_count_monthly_arr = send_query_counts(year, action="opt_in")

        return jsonify({
            'success': True,
            'data': optin_count_monthly_arr
        })

    @app.route("/get_monthly_points_expired", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def get_monthly_points_expired():
        year = request.args.get('year')
        points_expired_count_monthly_arr = send_query_counts(year, action="points_expired")
        return jsonify({
            'success': True,
            'data': points_expired_count_monthly_arr
        })

    @app.route("/get_monthly_referral", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def get_monthly_referral():
        year = request.args.get('year')
        referrals_count_monthly_arr = send_query_counts(year, action="referral")
        return jsonify({
            'success': True,
            'data': referrals_count_monthly_arr
        })
    
    @app.route("/get_points_spend", methods=["GET"])
    #TODO: make for every month of a year. Receive year from frontend/clientapi. Does it make sense to receive year from client?
    def get_points_spend():
        year = request.args.get('year')
        point_spend_count_monthly_arr = send_query_counts(year, action="point_spend")
        return jsonify({
            'success': True,
            'data': point_spend_count_monthly_arr
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