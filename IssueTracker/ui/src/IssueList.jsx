import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { Route } from 'react-router-dom';
import graphQLFetch from './graphQL.js';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import IssueDescription from './IssueDescription.jsx';

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue=this.deleteIssue.bind(this);
  }

  async componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search } } = this.props;
    const param = new URLSearchParams(search);
    const vars = {};
    if (param.get('status')) {
      vars.status = param.get('status');
    }
    const effortMin = parseInt(param.get('effortMin'), 10);
    if(!Number.isNaN(effortMin)) {
      vars.effortMin = effortMin;
    }
    const effortMax = parseInt(param.get('effortMax'), 10);
    if(!Number.isNaN(effortMax)) {
      vars.effortMax = effortMax;
    }
    const query = `
          query issueList(
            $status:StatusType
            $effortMin: Int
            $effortMax: Int
            ){
              issueList(
                status:$status
                effortMin: $effortMin
                effortMax: $effortMax
                ){
                  id
                  status
                  owner
                  title
                  effort
                  created
                  due
              }
          }`;
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }
  async closeIssue(index) {
    const query = `mutation issueClose($id: Int!){
      issueUpdate(id: $id, changes: {status: Closed}) {
        id title status owner 
        effort created due description
      }
    }`;
    const { issues } = this.state;
    const data = await graphQLFetch(query, {id : issues[index].id });
    if(data) {
      this.setState((prevState)=>{
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return { issues : newList };
      });
    }else{
      this.loadData();
    }
  }
  async deleteIssue(index){
    const query = `mutation issueDelete($id: Int!){
      issueDelete(id: $id)
    }`;
    const {issues} = this.state;
    const { location: {pathname, search}, history} = this.props;
    const { id } = issues[index];
    const data = await graphQLFetch(query, {id});
    if( data && data.issueDelete ) {
      this.setState((prevState)=>{
        const newList = [...prevState.issues];
        if (pathname ===`/issues/${id}`) {
          history.push({pathname:'/issues',search});
        }
        newList.splice(index,1);
        return {issues: newList};
      });
    }else{
      this.loadData();
    }
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

  render() {
    const { issues } = this.state;
    const { match } = this.props;
    return (
      <>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={issues} closeIssue={this.closeIssue} deleteIssue={this.deleteIssue}/>
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        <hr />
        <Route path={`${match.path}/:id`} component={IssueDescription} />
      </>
    );
  }
}
