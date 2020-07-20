import React from 'react';
import graphQLFetch from './graphQL';
import store from './store.js';
import IssueFilter from './IssueFilter.jsx';
import withToast from './withToast.jsx'
import {Accordion, Card,  Table } from 'react-bootstrap';

class IssueReport extends React.Component {
  constructor(props){
    super(props);
    const stats = store.intialData ? store.intialData.IssueCounts : null;
    delete store.intialData;
    this.state={
      stats
    }
  }
  componentDidMount(){
    const { stats } = this.state;
    if(stats == null) this.loadData();
  }
  componentDidUpdate(prevProps){
    const { location:{ search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if(prevSearch != search){
      this.loadData();
    }
  }
  async loadData(){
    const { location: { search }, match, showError} = this.props;
    const data = await this.fetchdata(match, search, showError);
    if(data) {
      this.setState({stats: data.IssueCounts});
    }
  }
  async fetchdata(match, search, showError){
    const params = new URLSearchParams(search);
    const vars = {};
    if(params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'),10);
    if(!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'),10);
    if(!Number.isNaN(effortMax)) vars.effortMin = effortMax;
    const query = `query issueList(
      $status : StatusType
      $effortMin : Int
      $effortMax : Int
    ){
      IssueCounts(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ){
        owner New Assigned Fixed Closed
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }
  render(){
    const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];
    const headerColumns = ( statuses.map (status => 
        (
          <th key={status}>{status}</th>
        )
      )    
    );
    const { stats } = this.state;
    if(stats == null ) return null;
    const statRows = stats.map(counts => (
      <tr key={counts.owner}>
        <td>{counts.owner}</td>
        {statuses.map(status=>(
          <td key={status}>{counts[status]}</td>
        ))}
      </tr>
    ));
    return (
      <>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              <Card.Title>Filter</Card.Title>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <IssueFilter urlBase="/report"/>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Table bordered condensed hover responsive>
          <thead>
            <tr>
              <th />
              {headerColumns}
            </tr>
          </thead>
          <tbody>
            {statRows}
          </tbody>
        </Table>
      </>
    );
  }
}
const IssueReportWithToast = withToast(IssueReport);
IssueReportWithToast.fetchdata = IssueReport.fetchdata;
export default IssueReportWithToast;
