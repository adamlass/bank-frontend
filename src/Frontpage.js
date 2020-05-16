
import React, { Component } from 'react';
import { Container, Row, Col, Button, CardBody, Card } from 'reactstrap';
import Account from './Account';
import pig from "./pig.png"


class Frontpage extends Component {

    state = {
        input: {
            cpr: "0113973313"
        },
        accounts: [],
        status: ""
    }

    handleKeyPressed = (e) => {
        let input = Object.assign({}, this.state.input)
        input[e.target.name] = e.target.value
        this.setState({ input })
    }

    fetchAccounts = async (e) => {
        e.preventDefault()

        let result = await fetch(`http://localhost:3000/account/${this.state.input.cpr}`, { method: "GET" })
        this.setState({ status: `Searching...` })

        console.log(result)
        if (result.status !== 200) {
            this.setState({ accounts: [] })

            this.setState({ status: `Could not find any accounts on CPR: ${this.state.input.cpr}` })
            return
        }

        result = await result.json()

        console.log(result)
        this.setState({ status: `` })

        this.setState({ accounts: result })
    }




    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col xs={1}>
                            <img src={pig} style={{ height: "65px" }} className="mt-2" />
                        </Col>
                        <Col xs={11}>
                            <h1 style={{ color: "#fc2bc1" }} className="mt-3">The Picky Bank</h1>
                        </Col>
                    </Row>
                    <br />
                    <form onSubmit={this.fetchAccounts}>
                        <Row>
                            <Col>
                                <input style={{ float: "right", height: 38 }} minLength={10} maxLength={10} type="text" value={this.state.cpr} onChange={this.handleKeyPressed} on={this.fetchAccounts} name="cpr" />
                            </Col>
                            <Col>
                                <Button type="submit" style={{ backgroundColor: "#fc2bc1", border: "none" }} >Search</Button>
                            </Col>
                        </Row>
                    </form>

                    <Row className="mt-3 text-center">
                        <Col xs={12}>
                            <h4 id={"errorFetch"}>{this.state.status}</h4>
                        </Col>
                        <Col style={{ margin: "auto", maxWidth: 600 }}>
                            {
                                this.state.accounts.map(acc => <Account acc={acc} refetch={this.fetchAccounts} />)
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Frontpage;