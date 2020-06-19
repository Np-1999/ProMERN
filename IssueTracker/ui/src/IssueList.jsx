import React from 'react';
import graphQLFetch from './graphQL.js';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  async componentDidMount() {
    this.loadData();
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue:IssueInputs!){
                  issueAdd(issue:$issue){
                      id
                  }
              }`;
    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  async loadData() {
    const query = `
          query{
              issueList{
                  id
                  status
                  owner
                  title
                  effort
                  created
                  due
              }
          }`;
    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  render() {
    const { issues } = this.state;
    return (
      <>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </>
    );
  }
}
