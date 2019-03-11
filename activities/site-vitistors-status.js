'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    api.initialize(activity);

    var dateRange = cfActivity.dateRange(activity, "today");
    let start = dateRange.startDate.split('T')[0]; //get just date (yyyy-mm-dd)
    let end = dateRange.endDate.split('T')[0]; //get just date (yyyy-mm-dd)

    const response = await api(`/analytics/v3/data/ga?metrics=ga:users&start-date=${start}&end-date=${end}`);

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }

    let visitsCount = {
      title: 'Total Visits',
      url: 'https://analytics.google.com/analytics/web/',
      urlLabel: 'All Visits',
    };

    let visitCount = response.body.totalsForAllResults['ga:users'];

    if (visitCount != 0) {
      visitsCount = {
        ...visitsCount,
        description: `You have total of ${visitCount > 1 ? visitCount + " visits" : visitCount + " visit"}`,
        color: 'blue',
        value: response.body.length,
        actionable: true
      };
    } else {
      visitsCount = {
        ...visitsCount,
        description: `You have no visits.`,
        actionable: false
      };
    }

    activity.Response.Data = visitsCount;
  } catch (error) {
    cfActivity.handleError(activity, error);
  }
};