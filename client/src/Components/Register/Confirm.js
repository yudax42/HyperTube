import React, { Component } from 'react';
import GuestRoute from '../Helpers/GuestRoute';
import axios from 'axios';

export default class Confirm extends Component {


    constructor(props) {
        super(props);
        this.state = {
            status: 0
        }
    }

    async componentDidMount() {
        try {
            const { token } = this.props.match.params;
            if (token && token.length > 2 && token !== 0 ) {
                const result = await axios.patch('/api/user/activation',
                    {
                        token
                    }
                )
                if ( result.status === 200 && result.data.success ) {
                    await this.setState({ status :  1 });
                    this.props.history.push('/login');
                }
                else 
                    await this.setState({ status :  -1 });
            }
            else await this.setState({ status :  -1 });
        } catch (e) {
            await this.setState({ status :  -1 });
        }
    }

    render() {
        return (
            <div className="Confrimationpage">
                <GuestRoute />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 m-auto">
                            <div className="h-input-card">
                                <div className="content">
                                    <div className="h-logo-main"><span>
                                        {
                                            (this.state.status === 1)
                                            ? "Account has been activated"
                                            : (this.state.status === -1)
                                            ? "Invalid token" 
                                            : "Confirming your email address..."
                                        }
                                    </span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
