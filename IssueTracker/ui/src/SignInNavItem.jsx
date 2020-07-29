import React from 'react';
import { Modal, Button, NavItem, NavDropdown } from 'react-bootstrap';
import withToast from './withToast.jsx';
import DropdownItem from 'react-bootstrap/DropdownItem';


class SignInNavItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    componentDidMount(){
        const clientId = window.ENV.GOOGLE_CLIENT_ID;
        if(!clientId) return ;
        window.gapi.load('auth2',()=>{
            if(!window.gapi.auth2.getAuthInstance()){
                window.gapi.auth2.init({client_id:clientId}).then(()=>{
                    this.setState({disabled:false});
                });
            }
        });    
    }
    showModal(){
        const clientId =  window.ENV.GOOGLE_CLIENT_ID;
        const {showError} = this.props;
        if(!clientId){
            showError('Missing environment variable');  
        }
        this.setState({showing: true});
    }
    hideModal(){
     this.setState({showing: false});   
    }
    async signIn(){
        const { showError } = this.props;
        this.hideModal();
        let googleToken;
        try{
            const auth2 = window.gapi.auth2.getAuthInstance();
            const googleUser = await auth2.signIn();
            googleToken = googleUser.getAuthResponse().id_token;
        }catch(error){
            showError('error');
            console.log('Auth Error');
        }
        try{
            const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
            const response = await fetch(
                `${apiEndpoint}/signin`,{
                    method: 'POST',
                    credentials: 'include',
                    headers : {'Content-Type':'application/json'},
                    body: JSON.stringify({google_token: googleToken}),
                }
            );
            const body = await response.text();
            const result = JSON.parse(body);
            const { signedIn, givenName } = result;
            const { onUserChange } = this.props;    
            onUserChange({signedIn,givenName});
        }catch(error){
            showError('Error');
        }
    }
    async signOut(){
        const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
        const { showError } = this.props;
        try{
            await fetch(`${apiEndpoint}/signout`, {
                method: 'POST',
                credentials: 'include',
            });
            const auth2  = window.gapi.auth2.getAuthInstance();
            await auth2.signOut();
            const { onUserChange } = this.props;
            onUserChange({signedIn: false, givenName:''});
        }catch(error){
            showError('Error signing out');
        }
    }
    
    render(){
        const { user } = this.props;
        if(user.signedIn){
            return(
                <NavDropdown title={user.givenName} id="user">
                    <DropdownItem onClick={this.signOut}>Sign Out</DropdownItem>
                </NavDropdown>
            );
        }
        const { showing, disabled } = this.state;
        return(
            <>
                <NavItem onClick={this.showModal}>
                    Sign In
                </NavItem>
                <Modal keyboard show={showing} onHide={this.hideModal} bsSize="sm">
                    <Modal.Header>
                        Sign In
                    </Modal.Header>
                    <Modal.Body>
                        <Button block bsStyle="primary" onClick={this.signIn} disabled={disabled}>
                            <img src="https://goo.gl/4yjp6B"  alt="Sign-In" />
                        </Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );    
    }
}
export default withToast(SignInNavItem);