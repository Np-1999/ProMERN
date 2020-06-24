/* eslint "react/prefer-stateless-function": "off" */
import React from 'react';
import { withRouter } from 'react-router-dom';
import URLSearchParams from '@ungap/url-search-params'

class IssueFilter extends React.Component {
  constructor({ location: { search }}) {
    super();
    const params = new URLSearchParams(search);
    this.state = { 
      status: params.get('status') || "",
      effortMin: params.get('effortMin') || "",
      effortMax: params.get('effortMax') || "",
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
    /*const status = e.target.value;
    const { history } = this.props;
    history.push({
      pathname: '/issues',
      search: status ? `?status=${status}` : '',
    });*/
  }
  onChangeEffortMin(e){
    const effortString = e.target.value;
    if(effortString.match(/^\d*$/)) {
      this.setState({ 
        effortMin: e.target.value,
        changed: true
      })
    }
  }
  onChangeEffortMax(e){
    const effortString = e.target.value;
    if(effortString.match(/^\d*$/)) {
      this.setState({ 
        effortMax: e.target.value,
        changed: true
      })
    }
  }
  applyFilter(){
    const { status, effortMin, effortMax } = this.state;
    const { history } = this.props;
    const params = new URLSearchParams();
    if (status) {
      params.set('status',status);
    }
    if(effortMin) {
      params.set('effortMin', effortMin);
    }
    if(effortMax) {
      params.set('effortMax', effortMax);
    }
    const search = params.toString()  ? `?${params.toString()}` : "";
    history.push({
      pathname: '/issues',
      search
    });
  }
  showOriginalFilter(){
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') ||"",
      effortMin: params.get('effortMin') || "",
      effortMax: params.get('effortMax') || "",
      changed: false,
    });
  }
  componentDidUpdate(prevProps){
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if(prevSearch != search){
      this.showOriginalFilter();
    }
  }
  render() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    const { status, changed, effortMin, effortMax } = this.state;
    return (
      <div>
        Status &nbsp;
        <select value={status} onChange={this.onChangeStatus}>
          <option value="">(ALL)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
        </select>
        {' '}
        <input size={5} value={effortMin} onChange={this.onChangeEffortMin} />
        {'-'}
        <input size={5} value={effortMax} onChange={this.onChangeEffortMax} />
        {' '}
        <button type="button" onClick={this.applyFilter}>Apply</button>
        {' '}
        <button type="button" onClick={this.showOriginalFilter} disabled={!changed}>Reset</button>
      </div>
    );
  }
}
export default withRouter(IssueFilter);
