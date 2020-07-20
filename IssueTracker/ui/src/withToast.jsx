import React from 'react';
import { Toast } from 'react-bootstrap';

export default function withToast(OriginalComponent) {
    return class ToastWrapper extends React.Component {
        constructor(props) {
            super (props);
            this.state = {
                toastMessage: '',
                toastShow: false,
            };
            this.showError = this.showError.bind(this);
            this.showSucess = this.showSucess.bind(this);
        }
        showError(message) {
            this.setState({ toastShow: true, toastMessage: message });
          }
        showSucess(message) {
            this.setState({ toastShow: true, toastMessage: message });
        }
        render(){
            const { toastMessage, toastShow } = this.state;
            return(
                <React.Fragment>
                    <OriginalComponent
                    showError={this.showError}
                    showSucess={this.showSucess}
                    {...this.props} />
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
                </React.Fragment>
            )
        }
    }
}