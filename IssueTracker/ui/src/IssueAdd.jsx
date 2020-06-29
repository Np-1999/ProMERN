import React from 'react';
import {
  Form, FormLabel, FormControl, FormGroup, Button,
} from 'react-bootstrap';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const { createIssue } = this.props;
    createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    return (
      <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
        <FormGroup className="mr-2">
          <FormLabel className="mr-2">Owner:</FormLabel>
          {' '}
          <FormControl type="text" name="owner" />
        </FormGroup>
        <FormGroup>
          {' '}
          <FormLabel className="mr-2">Title:</FormLabel>
          {' '}
          <FormControl type="text" name="title" className="mr-2" />
        </FormGroup>
        <Button variant="primary" type="submit">Add</Button>
      </Form>
    );
  }
}
