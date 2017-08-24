/*
* HomePage
*
* The Dashboard is only visible to logged in users
* Route: /dashboard
*
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Bar as BarChart, Line as LineChart} from 'react-chartjs-2';
import R from 'ramda';

class Dashboard extends Component {
  getValidateSet() {
    const username = localStorage.getItem("username");
    const validateSet = localStorage.getItem("validateSet:" + username);

    return JSON.parse(validateSet) || [];
  }

  render() {
    const validateSet = this.getValidateSet();

    const barChartData = {
      labels: R.range(0, 15),
      datasets: [{
        label: "test 1",
        backgroundColor: ['rgb(153, 50, 204)', 'rgb(255, 0, 0)', 'rgb(0, 255, 0)'],
        data: [25, 30, 100]
      }]
    };

    const barChartOptions = {
      tooltip: {
        enabled: false,
      }
    }

    const datasets = R.addIndex(R.map)((data, idx) => ({ label: idx, data }), validateSet || []);
    if (R.isEmpty(datasets)) {
      datasets.push({
        label: "default",
        data: [],
      });
    }

    const xRayNum = R.length(validateSet[0]) || 10;
    const lineChartData = {
      labels: R.range(0, xRayNum),
      datasets,
    };

    const detailChartOptions = {
      elements: {
            line: {
                tension: 0, // disables bezier curves
            }
        },
      fill : false,
    };
    
    return (
    <div className="dashboard_content">
    <h2>Confidential</h2>
    <BarChart data={barChartData} options={barChartOptions} width="600" height="400" />
    <h2>Detail</h2>
    <LineChart data={lineChartData} options={detailChartOptions} width="600" height="400" />
    </div>
    );
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(Dashboard);
