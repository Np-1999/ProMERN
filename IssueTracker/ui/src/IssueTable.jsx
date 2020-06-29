import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import { X, Trash, PencilSquare } from 'react-bootstrap-icons';
import { LinkContainer } from 'react-router-bootstrap';

const IssueRow = withRouter(({
  issue, location: { search }, closeIssue, index, deleteIssue,
}) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };

  const closeToolTip = (
    <Tooltip id="close-ToolTip" placement="bottom">Close Issue</Tooltip>
  );
  function deleteToolTip(props) {
    return (
      <Tooltip id="delete-tooltip" {...props}>Delete Issue</Tooltip>
    );
  }
  function editToolTip(props) {
    return (
      <Tooltip id="edit-tooltip" {...props}>Edit Issue</Tooltip>
    );
  }
  function onDelete(e){
    e.preventDefault();
    deleteIssue(index);
  }
  function onClose(e){
    e.preventDefault();
    closeIssue(index);
  }
  const tableRow = (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ''}</td>
      <td>{issue.title}</td>
      <td>
        <OverlayTrigger placement="bottom" delayShow={1000} overlay={editToolTip}>
          <LinkContainer to={`/edit/${issue.id}`}>
            <Button size="sm"><PencilSquare /></Button>
          </LinkContainer>
        </OverlayTrigger>
        {'   '}
        <OverlayTrigger delayShow={1000} overlay={closeToolTip} placement="bottom">
          <Button size="sm" onClick={onClose }><X /></Button>
        </OverlayTrigger>
        {'   '}
        <OverlayTrigger placement="bottom" delayShow={1000} overlay={deleteToolTip}>
          <Button size="sm" onClick= { onDelete } ><Trash /></Button>
        </OverlayTrigger>
      </td>
    </tr>
  );
  return (
    <LinkContainer to={selectLocation}>
      {tableRow}
    </LinkContainer>
  );
});

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      index={index}
      deleteIssue={deleteIssue}
    />
  ));
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}
