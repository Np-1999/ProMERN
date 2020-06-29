import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { Route } from 'react-router-dom';
import { Accordion, Card, Toast } from 'react-bootstrap';
import graphQLFetch from './graphQL.js';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import IssueDescription from './IssueDescription.jsx';

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: [],
      toastMessage: '',
      toastShow: false,
    };
    this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showError = this.showError.bind(this);
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

  showError(message) {
    this.setState({ toastShow: true, toastMessage: message });
  }

  showSucess(message) {
    this.setState({ toastShow: true, toastMessage: message });
  }

  async loadData() {
    const { location: { search } } = this.props;
    const param = new URLSearchParams(search);
    const vars = {};
    if (param.get('status')) {
      vars.status = param.get('status');
    }
    const effortMin = parseInt(param.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) {
      vars.effortMin = effortMin;
    }
    const effortMax = parseInt(param.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) {
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
    const data = await graphQLFetch(query, vars, this.showError);
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
    const data = await graphQLFetch(query, { id: issues[index].id });
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return { issues: newList };
      });
      this.showSucess('Issue closed');
    } else {
      this.loadData();
    }
  }

  async deleteIssue(index) {
    const query = `mutation issueDelete($id: Int!){
      issueDelete(id: $id)
    }`;
    const { issues } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = issues[index];
    const data = await graphQLFetch(query, { id });
    if (data && data.issueDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        if (pathname === `/issues/${id}`) {
          history.push({ pathname: '/issues', search });
        }
        newList.splice(index, 1);
        return { issues: newList };
      });
      this.showSucess('Issue Deleted successfully');
    } else {
      this.loadData();
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue:IssueInputs!){
                  issueAdd(issue:$issue){
                      id
                  }
              }`;
    const data = await graphQLFetch(query, { issue }, this.showError);
    if (data) {
      this.loadData();
      this.showSucess('Issue Added sucessfully');
    }
  }

  render() {
    const { issues } = this.state;
    const { match } = this.props;
    const { toastShow, toastMessage } = this.state;
    return (
      <>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              <Card.Title>Filter</Card.Title>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>

                <IssueFilter />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <IssueTable issues={issues} closeIssue={this.closeIssue} deleteIssue={this.deleteIssue} />
        <IssueAdd createIssue={this.createIssue} />
        <Toast
          show={toastShow}
          delay={3000}
          onClose={() => this.setState({ toastShow: false })}
          autohide
        >
          <Toast.Body>
            {' '}
            {toastMessage}
          </Toast.Body>
        </Toast>
        <Route path={`${match.path}/:id`} component={IssueDescription} />
      </>
    );
  }
}
