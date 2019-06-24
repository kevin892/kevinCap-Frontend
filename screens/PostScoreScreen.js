import React, { Component } from 'react';
import Slider from "react-native-slider";
import {Alert, NativeModules} from "react-native";
import { Label, Button, Container, Header, Content, Form, Text, Item, Icon, Input, Picker} from 'native-base';
import NumericInput from 'react-native-numeric-input'
import DatePicker from 'react-native-datepicker'


export default class PostScoreScreen extends Component {
    state = {
       holes_played: 18,
       score: 72,
       date: '',
       course: '',
       course_handicap: 72,
       tees: '',
       course_rating: 74,
       putts: 36,
       slope: 115,
       gir: 18

    };

  submitPost = () => {
    return fetch('https://floating-ocean-58632.herokuapp.com/logs', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    course: this.state.course,
    score: this.state.score,
    user_id: 1,
    date: this.state.date,
    holes_played: this.state.holes_played,
    course_handicap: this.state.course_handicap,
    tees: this.state.tees,
    course_rating: this.state.course_rating,
    putts: 36,
    slope: 115,
    gir: 18

  })
}).then((response) => response.json())
    .then((responseJson) => {
      Alert.alert('Round Posted!')
      setTimeout(() => {
NativeModules.DevSettings.reload();
}, 2000);
      ;
    })
    .catch((error) => {
      Alert.alert('Unable to post :(');
    });
  }

  render() {
    return (
      <Container>
        <Content style={{backgroundColor: '#C7EFCF', paddingTop: 50}}>
          <Text style={{color: '#414141',alignSelf: 'center',margin: 10, fontSize: 45, fontFamily: 'AppleSDGothicNeo-UltraLight'}}>Post Round 📌</Text>
          <Form>
        <Item style={{marginTop: 30, alignSelf: 'center', width: 350,marginBottom: 5, borderRadius: 5,backgroundColor: 'white'}} regular>
        <Input  onChangeText={(course) => this.setState({course})}
    value={this.state.course} placeholder='Course' />
      </Item>
              <Item picker style={{backgroundColor: 'white', alignSelf: 'center', width: 350,marginBottom: 5, borderRadius: 5}}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon style={{position: 'relative', right: 80}}name="arrow-down" />}
                  placeholder="Tees"
                  placeholderStyle={{fontFamily: 'AppleSDGothicNeo-UltraLight', color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.tees}
                  onValueChange={value => this.setState({tees:value})}
                >
                  <Picker.Item label="Tips" value="Tips" />
                  <Picker.Item label="Golds" value="Golds" />
                  <Picker.Item label="Blues" value="Blues" />
                  <Picker.Item label="Greens" value="Greens" />
                  <Picker.Item label="Reds" value="Reds" />
                </Picker>
              </Item>


              <Content>
                <DatePicker
                      style={{width: 300, margin:30,backgroundColor: '#C7EFCF'}}
                      date={this.state.date}
                      mode="date"
                      placeholder="Date Played"
                      format="YYYY-MM-DD"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          // top: 4,
                          marginLeft: 0,
                          backgroundColor: '#C7EFCF',
                          height:40
                          // padding: 20
                        },
                        dateInput: {
                          marginLeft: 36,
                          backgroundColor: 'white',
                          borderRadius: 5
                        }
                      }}
                      onDateChange={(date) => {this.setState({date: date})}}
                    />
            </Content>

            <Content style={{width: 200,backgroundColor: 'white', borderColor: '#bfc6ea', borderRadius: 4, borderWidth: 1, padding: 25, marginLeft: 20}}>

              <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 10}}>Score</Label>
              <NumericInput maxValue={150} minValue={45} value={this.state.score} step={1} onChange={val => this.setState({ score: val })} />

    <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 20}}>Holes Played</Label>
    <NumericInput maxValue={18} minValue={1}value = {this.state.holes_played}onChange={val => this.setState({ holes_played: val })} />

            <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 20}}>Course Par</Label>
            <NumericInput maxValue={80} minValue={27} value = {this.state.course_handicap} onChange={val => this.setState({ course_handicap: val })} />

            <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 20}}>Course Rating</Label>
            <NumericInput maxValue={100} minValue={1}value = {this.state.course_rating}onChange={val => this.setState({ course_rating: val })} />

              <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 20}}>Slope</Label>
              <NumericInput maxValue={200} minValue={1}value = {this.state.slope}onChange={val => this.setState({ slope: val })} />

                <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 20}}>Putts</Label>
                <NumericInput maxValue={100} minValue={1}value = {this.state.putts}onChange={val => this.setState({ putts: val })} />

                  <Label style={{color: '#414141',fontFamily: 'AppleSDGothicNeo-SemiBold',fontSize: 20,paddingTop: 20}}>Greens In Regulation</Label>
                  <NumericInput maxValue={36} minValue={0}value = {this.state.gir}onChange={val => this.setState({ gir: val })} />
                  </Content>

            <Button style={{marginTop: 30, marginBottom: 100}} onPress={() => {this.submitPost()}} block info>
            <Text style={{color: 'white',fontFamily: 'AppleSDGothicNeo-UltraLight',fontSize: 30}}>Post Round
            </Text>
          </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

PostScoreScreen.navigationOptions = {
  title: 'KevinCap ⛳️',
};
