import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion, Card, Form, FormLabel, Col, FormControl,
  FormGroup, Row, ButtonToolbar, ButtonGroup, Button, Alert
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import graphQLFetch from './graphQL.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import store from './store';
import withToast from './withToast.jsx';
import UserContext from './UserContext.jsx';

class IssueEdit extends React.Component {

  constructor() {
    const issue = store.intialData ? store.intialData.issue : null;
    delete store.intialData;
    super();
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
  }
  static async fetchData(match, search, showError){
    const query = ` query issue($id: Int!) {
        issue(id: $id) {
          id title status owner effort created
          due description
        }
      }`;
    let {  params: { id }  } = match;
    id = parseInt(id, 10);
    const result= await graphQLFetch(query, { id }, showError);
    return result;
  }

  componentDidMount() {
    const { issue } = this.state;
    if( issue==null ){
      this.loadData();
    }
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevID } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (prevID !== id) {
      this.loadData();
    }
  }

  onChange(e, naturalValue) {
    const { name, value: textValue } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }

  onValidityChange(e, valid) {
    const { name } = e.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) {
        delete invalidFields[name];
      }
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const {showError}=this.props;
    const { issue, invalidFields, showingValidation } = this.state;
    console.log(showingValidation);
    if (Object.keys(invalidFields).length !== 0) {
      return;
    }
    const query = `mutation issueUpdate(
      $id: Int!
      $changes: issueUpdateInputs!
    ){
      issueUpdate(
        id: $id
        changes: $changes
      ){
        id title status owner created effort
        due description
      }
    }`;
    const { id, created, ...changes } = issue;
    const data = await graphQLFetch(query, { changes, id },showError);
    if (data) {
      this.setState({
        issue: data.issueUpdate,
      });
      console.log('After query ');
      showError('Updated issue successfully');
    }
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }


  async loadData() {

    const { match } = this.props;
    const { showError } = this.props;
    const data = await IssueEdit.fetchData(match,null,showError);
    this.setState({ issue: (data ? data.issue : {}), invalidFields: {} });
  }

  render() {
    const { issue } = this.state;
    if( issue==null ) return null;
    const { issue: { id } } = this.state;
    console.log(id);
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found`}</h3>;
      }
      return null;
    }
    const { issue: { title, status } } = this.state;
    const { issue: { owner, effort, description } } = this.state;
    const { issue: { created, due } } = this.state;
    const {
      invalidFields, showingValidation
    } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert dismissible variant="danger" onClose={this.dismissValidation}>
          Please correct invalid fields before submitting
        </Alert>
      );
    }
    const user = this.context;
    return (
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <Card.Title>{`Editing issue ${id}`}</Card.Title>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card>
              <Card.Body>
                <Form noValidate horizontal onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>Created:</Col>
                      <Col sm={9}>
                        <Form.Control plaintext readOnly defaultValue={created.toDateString()} />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>Status:</Col>
                      <Col sm={9}>
                        <FormControl as="select" value={status} onChange={this.onChange} name="status">
                          <option value="New">New</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Fixed">Fixed</option>
                          <option value="Closed">Closed</option>
                        </FormControl>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>Owner:</Col>
                      <Col sm={9}>
                        <FormControl as={TextInput} value={owner} onChange={this.onChange} key={id} name="owner" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>Effort:</Col>
                      <Col sm={9}>
                        <FormControl as={NumInput} value={effort} onChange={this.onChange} key={id} name="effort" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>Due:</Col>
                      <Col sm={9}>
                        <FormControl
                          as={DateInput}
                          value={due}
                          pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])"
                          onChange={this.onChange}
                          onValidityChange={this.onValidityChange}
                          name="due"
                          key={id}
                        />
                        <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>
                        <FormLabel>Title:</FormLabel>
                      </Col>
                      <Col sm={9}>
                        <FormControl as={TextInput} value={title} onChange={this.onChange} name="title" key={id} />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>Description:</Col>
                      <Col sm={9}>
                        <FormControl as={TextInput} tag="textarea" value={description} onChange={this.onChange} key={id} name="description" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm={3}>
                      </Col>
                      <Col sm={6}>
                        <ButtonToolbar>
                          <ButtonGroup className="mr-2">
                            <Button disabled={!user.signedIn} variant="primary" type="submit">Submit</Button>
                          </ButtonGroup>
                          <ButtonGroup>
                            <LinkContainer to="/issues">
                              <Button variant="link">Back</Button>
                            </LinkContainer>
                          </ButtonGroup>
                        </ButtonToolbar>
                      </Col>
                    </Row>
                  </FormGroup>
                </Form>
                {validationMessage}
              </Card.Body>
              <Card.Footer>
                <Link to={`/edit/${id - 1}`}>Prev</Link>
                {' | '}
                <Link to={`/edit/${id + 1}`}>Next</Link>
              </Card.Footer>
            </Card>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}
IssueEdit.contextType = UserContext;
const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;
export default IssueEditWithToast;