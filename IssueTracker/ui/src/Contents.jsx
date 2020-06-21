import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import IssueList from './IssueList.jsx';
import IssueReport from './IssueReport.jsx';
import IssueEdit from './IssueEdit.jsx';

const notFound = () => <h1> Page not found </h1>;
// Router
export default function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/issues" />
      <Route path="/issues" component={IssueList} />
      <Route path="/report" component={IssueReport} />
      <Route path="/edit/:id" component={IssueEdit} />
      <Route component={notFound} />
    </Switch>
  );
}
