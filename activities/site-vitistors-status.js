'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {

    var dateRange = Activity.dateRange("today");
    let start = dateRange.startDate.split('T')[0]; //get just date (yyyy-mm-dd)
    let end = dateRange.endDate.split('T')[0]; //get just date (yyyy-mm-dd)

    const response = await api(`/analytics/v3/data/ga?metrics=ga:users&start-date=${start}&end-date=${end}`);

    if (Activity.isErrorResponse(response)) return;

    let visitStatus = {
      title: T('Total Visits'),
      url: 'https://analytics.google.com/analytics/web/',
      urlLabel: T('All Visits'),
    };

    let visitCount = response.body.totalsForAllResults['ga:users'];
    visitCount = 2;
    if (visitCount != 0) {
      visitStatus = {
        ...visitStatus,
        description: visitCount > 1 ? T(`You have total of {0} visits.`, visitCount) : T(`You have total of 1 visit.`),
        color: 'blue',
        value: response.body.length,
        actionable: true
      };
    } else {
      visitStatus = {
        ...visitStatus,
        description: T(`You have no visits.`),
        actionable: false
      };
    }

    activity.Response.Data = visitStatus;
  } catch (error) {
    Activity.handleError(error);
  }
};