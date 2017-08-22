/*
* HomePage
*
* The Dashboard is only visible to logged in users
* Route: /dashboard
*
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Bar as BarChart, Line as LineChart } from "react-chartjs";
import R from 'ramda';

class Dashboard extends Component {
  render() {
    const barChartData = {
      labels: R.range(1, 15),
      datasets: [{
        label: 'Dataset',
        fillColor: 'rgb(153, 50, 204)',
        data: [20, 98, 60]
      }]
    };

    const barChartOptions = {
      tooltipTemplate: "<%= value %>",
    }

    const lineChartData = {
      labels: R.range(1, 10),
      datasets: [{
        label: 'Dataset',
        data: [20, 98, 60, 40, 50, -50, 20]
      }]
    };

    const detailChartOptions = {
      bezierCurve: false,
      datasetFill : false,
      tooltipTemplate: "<%= value %>",
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
