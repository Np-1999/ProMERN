import React from 'react';
import {
  OverlayTrigger, Nav, Modal, FormGroup, FormControl,
  Tooltip, Form, FormLabel, ButtonToolbar, ButtonGroup, Button,
} from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQL.js';
class IssueAddNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      owner: '',
      title: '',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeOwner(e) {
    this.setState({
      owner: e.target.value,
    });
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { owner, title } = this.state;
    const issue = {
      owner,
      title,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const query = `mutation issueAdd($issue:IssueInputs!){
            issueAdd(issue:$issue){
                id
            }
        }`;
    const data = await graphQLFetch(query, { issue }, this.showError);
    if (data) {
      this.hideModal();
      console.log('success');
      const { history } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const {user: {signedIn}} = this.props;
    return (
      <>
        <Nav.Link disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger placement="left" delayShow={1000} overlay={<Tooltip>CreateIssue</Tooltip>}>
            <Plus />
          </OverlayTrigger>
        </Nav.Link>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title> Create Issue </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form name="issueAdd">
              <FormGroup>
                <FormLabel>
                  Owner:
                </FormLabel>
                <Form.Control name="owner" onChange={this.onChangeOwner} />
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  Title:
                </FormLabel>
                <FormControl name="title" onChange={this.onChangeTitle} />
              </FormGroup>
              <ButtonToolbar>
                <ButtonGroup className="mr-2">
                  <Button variant="primary" type="button" onClick={this.handleSubmit}>
                    Submit
                  </Button>
                </ButtonGroup>
                <Button variant="link" type="button" onClick={this.hideModal}>
                  Cancel
                </Button>
                <ButtonGroup />
              </ButtonToolbar>
            </Form>
          </Modal.Body>
          <Modal.Footer />

        </Modal>
      </>

    );
  }
}
export default withRouter(IssueAddNav);
