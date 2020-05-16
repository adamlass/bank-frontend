import React, { Component } from 'react';
import { Row, Col, Button, CardBody, Card, CardFooter } from 'reactstrap';
import trans from "./trans.png";
import down from "./down.png"
import up from "./up.png"
import pig from "./pig.png"
import pigFeeet from "./pigFeet.png"
import pigTail from "./pigTail.ico"
import hole from "./hole.png"
import pile from "./pile.png"
import { getUserLocale } from "get-user-locale";


class Account extends Component {

    state = {
        open: false,
        transferOpen: false,
        input: {
            amount: 0,
            number: "",
        },
        transferStatus: ""
    }

    handleKeyPressed = (e) => {
        let input = Object.assign({}, this.state.input)
        input[e.target.name] = e.target.value
        this.setState({ input })
    }

    toggleOpen = () => {
        this.setState({ open: !this.state.open })
    }

    toggleTransferOpen = () => {
        this.setState({ transferOpen: !this.state.transferOpen, transferStatus: "" })
    }

    transfer = async (e, accountNumber) => {
        e.preventDefault()

        const { amount, number } = this.state.input

        const body = {
            sourceNumber: accountNumber,
            targetNumber: number,
            amount
        }

        const headers = {
            "content-type": "application/json"
        }


        const result = await fetch("http://localhost:3000/transfer", { method: "POST", body: JSON.stringify(body), headers })
        if (result.status === 200) {
            this.setState({ transferStatus: "Transfer was sucessfull! Enjoy poverty (;" })
            this.props.refetch(e)
            let inputCopy = Object.assign({}, this.state.input)
            inputCopy.amount = 0
            inputCopy.number = ""
            this.setState({ input: inputCopy })
        } else {
            const body = await result.json()

            this.setState({ transferStatus: `Transfer Failed - Message: ${body.message}`})
        }

        this.setState({transferOpen:false })
    }

    render() {
        const { number, balance, movements } = this.props.acc

        const balanceColor = balance < 0 ? "red" : "green"
        return (
            <>
                {
                    <>
                        <Card className="mt-5 text-centered" style={{ borderRadius: "3rem", backgroundColor: "pink" }} id={`acc-${number}`} >
                            <CardBody>
                                <Row>
                                    <Col>
                                        <img src={hole} style={{ height: "20px", width: "62px", marginTop: "-35px" }} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        <img src={pig} style={{ marginLeft: "-88px", height: "150px", marginTop: "-74px" }} />
                                    </Col>
                                    <Col xs={9}>
                                        <h6 id={number}> {number}</h6>
                                        <h3 id={`bal-${number}`} style={{ color: balanceColor }}>{balance.toLocaleString(getUserLocale())} $</h3>


                                    </Col>
                                    <Col xs={1}>
                                        <Button close onClick={this.toggleTransferOpen} id={`trans-${number}`}>
                                            <span aria-hidden><img src={trans} /></span>
                                        </Button>
                                    </Col>
                                    <Col xs={1}>
                                        <img src={pigTail} style={{ height: "81px", marginTop: "-33px" }} />
                                    </Col>

                                </Row>
                                <h5>{this.state.transferStatus}</h5>
                                {this.state.transferOpen && this.state.transferStatus.length === 0 &&
                                    <>
                                        <Card style={{ backgroundColor: "#D4AF37", color: "white", border: "none" }} >
                                            <CardBody>
                                                <form onSubmit={e => this.transfer(e, number)}>
                                                    <h3>$ Transfer Money $</h3>
                                                    <hr />
                                                    <h4>Account Number</h4>
                                                    <input type="text" name="number" minLength={8} maxLength={8} value={this.state.input.number} onChange={this.handleKeyPressed} />
                                                    <br />
                                                    <h4>Amount</h4>
                                                    <input min={0} step={0.01} type="number" name="amount" value={this.state.input.amount} onChange={this.handleKeyPressed} />
                                                    <br />
                                                    <Button color="link">
                                                        <img src={pile} style={{ height: "65px" }} />
                                                    </Button>
                                                </form>


                                            </CardBody>

                                        </Card>
                                    </>
                                }
                                <hr className="mb-0" />


                                <Button onClick={this.toggleOpen} color="link" className="m-0">
                                    <>
                                        <img src={this.state.open ? up : down} />
                                    </>
                                </Button>


                                {this.state.open && <>

                                    <Row>
                                        <Col>
                                            <h5 className="mb-3">Transactions</h5>
                                            {movements.map(mov => {
                                                let { accountNumber, amount, time } = mov
                                                time = new Date(time)
                                                return (
                                                    <Card className="m-2 mb-4">
                                                        <CardBody >
                                                            <Row>
                                                                <Col xs={8}>
                                                                    <p>{amount < 0 ? "To" : "From"}: <h4>{accountNumber}</h4></p>
                                                                    <h5>{time.toLocaleDateString()} - {time.toLocaleTimeString()}</h5>

                                                                </Col>
                                                                <Col xs={4}>
                                                                    <h2 style={{ color: amount < 0 ? "red" : "green" }}>{amount.toLocaleString(getUserLocale())} $</h2>

                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                )

                                            })}
                                        </Col>
                                    </Row>

                                </>
                                }
                            </CardBody>
                            <Row>
                                <Col xs={6}>
                                    <img src={pigFeeet} style={{ height: 70, marginBottom: "-40px" }} />

                                </Col>
                                <Col xs={6}>
                                    <img src={pigFeeet} style={{ height: 70, marginBottom: "-40px" }} />

                                </Col>
                            </Row>

                        </Card>
                    </>
                }
            </>

        );
    }
}

export default Account;