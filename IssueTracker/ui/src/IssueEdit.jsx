import React from 'react';
import graphQLFetch from './graphQL.js';
import {Link} from 'react-router-dom';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';

export default class IssueEdit extends React.Component{
  constructor(){
    super();
    this.state = {
      issue: {},
      invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.handleSubmit =  this.handleSubmit.bind(this);
  }
  async loadData(){
    const query = ` query issue($id: Int!) {
      issue(id: $id) {
        id title status owner effort created
        due description
      }
    }`;
    let { match: { params: {id} }} = this.props;
    id = parseInt(id);
    const data = await graphQLFetch(query,{ id });
    console.log(data);
    this.setState({ issue: data ? data.issue: {}, invalidFields: {} });
  }
  onChange(e, naturalValue) {
    const {name, value: textValue} = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState=>({
      issue: { ...prevState.issue, [name]: value},
    }))
  }
  onValidityChange(e, valid) {
    const { name } = event.target;
    this.setState((prevState)=>{
      const invalidFields = { ...prevState.invalidFields, [name]: !valid};
      if (valid) {
        delete invalidFields[name];
      }
      return { invalidFields };
    });
  }
  handleSubmit(e){
    e.preventDefault();
    const { issue } = this.state;
    console.log(issue);
  }
  componentDidMount(){
    this.loadData();
  }
  componentDidUpdate(prevProps){
    const { match: {params: {id: prevID}}} = prevProps;
    const { match: {params: { id } } } = this.props;
    if(prevID !== id){
      this.loadData();
    } 
  }
  render(){
    const { issue : { id } } = this.state;
    console.log(id);
    const { match :{ params: { id : propsId }}} = this.props;
    if(id == null){
      if( propsId != null ){
        return <h3>{`Issue with ID ${propsId} not found`}</h3>
      }
      return null;
    }
    const { issue: { title, status } } = this.state;    
    const { issue: { owner, effort, description } } = this.state;    
    const { issue: { created, due } } = this.state;
    const { invalidFields } = this.state; 
    let validationMessage;
    if(Object.keys(invalidFields).length!==0){
      validationMessage = (
        <div className="error">
          Please correct invalid fields before submitting
          </div>
      );
    }
    return(
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing issue ${id}`}</h3> 
        <table>
          <tr>
            <td>Created</td>
            <td>{created.toDateString()}</td>
          </tr>
          <tr><td>Status:</td>
            <td>
              <select name="status" value={status} onChange={this.onChange}>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Closed">Closed</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Owner:</td>
            <td><TextInput name="owner" value={owner } onChange={this.onChange}/> </td>
          </tr>
          <tr>
            <td>Effort:</td>
            <td><NumInput name="effort" value={effort} onChange={this.onChange} key={id}/> </td>
          </tr>
          <tr>
            <td>Due:</td>
            <td><DateInput name="due" value={due} onChange={this.onChange} onValidityChange={this.onValidityChange} key={id}/> </td>
          </tr>
          <tr>
            <td>Title:</td>
            <td><TextInput name="title" value={title } onChange={this.onChange}/> </td>
          </tr>
          <tr>
            <td>Description:</td>
            <td><TextInput tag="textarea" rows={8} cols={50} name="description" value={description } onChange={this.onChange}/> </td>
          </tr>
          <tr>
            <td />
            <td><button type="submit">Submit</button></td>
          </tr>
        </table>
        {validationMessage}
        <Link to={`/edit/${id-1}`}>Prev</Link>
        {' | '}
        <Link to = {`/edit/${id+1}`}>Next</Link>
      </form>
    );
  }
}
