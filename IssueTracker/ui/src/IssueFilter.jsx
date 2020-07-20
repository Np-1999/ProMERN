/* eslint "react/prefer-stateless-function": "off" */
import React from 'react';
import { withRouter } from 'react-router-dom';
import URLSearchParams from '@ungap/url-search-params';
import {
  Button, FormControl, FormGroup, FormLabel, InputGroup,
  ButtonToolbar, ButtonGroup, Row, Col,
} from 'react-bootstrap';

class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({
        effortMax: e.target.value,
        changed: true,
      });
    }
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }

  onChangeEffortMin(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({
        effortMin: e.target.value,
        changed: true,
      });
    }
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { status, effortMin, effortMax } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    if (effortMin) {
      params.set('effortMin', effortMin);
    }
    if (effortMax) {
      params.set('effortMax', effortMax);
    }
    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({
      pathname: urlBase,
      search,
    });
  }

  render() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    const {
      status, changed, effortMin, effortMax,
    } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <FormLabel>Status &nbsp;</FormLabel>
            <FormControl as="select" value={status} onChange={this.onChangeStatus}>
              <option value="">(ALL)</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <FormLabel>Effort Between:</FormLabel>
            <InputGroup>
              <FormControl value={effortMin} onChange={this.onChangeEffortMin} />
              <InputGroup.Prepend><InputGroup.Text id="basic-addon3">-</InputGroup.Text></InputGroup.Prepend>
              <FormControl value={effortMax} onChange={this.onChangeEffortMax} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <FormLabel>&nbsp;</FormLabel>
            <ButtonToolbar>
              <ButtonGroup className="mr-2">
                <Button variant="primary" onClick={this.applyFilter}>
                  Apply
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="primary" onClick={this.showOriginalFilter} disabled={!changed}>Reset</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}
export default withRouter(IssueFilter);
