import React from 'react';
import {
  Container,
  Title,
  Header,
  Content,
  Accordion,
  Form,
  Card,
  CardItem,
  Body,
  Item,
  Input,
  Icon,
  Button
} from 'native-base';
import {
  Alert,
  FlatList,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class HomeScreen extends React.Component {
  state = {
    isLoading: true,
    dataSource: [],
    showAlert: false,
    currentId: 0
  }
  _keyExtractor = (item, index) => item.id.toString();

  filterRounds = (id) => {
    const rounds = this.state.dataSource.filter(round => round.id !== id)
    this.setState({dataSource: rounds, showAlert: false})
  }

  deletePost = (id) => {
    return fetch(`https://floating-ocean-58632.herokuapp.com/logs/${id}`, {method: "DELETE"}).then(this.filterRounds(id)).catch(error => console.log(error));
  }

  handleAlert = (id) => {
    this.setState({showAlert: true, currentId: id})
  }

  cancelAlert = () => {
    this.setState({showAlert: false})
  }

  componentDidMount() {
    return fetch('https://floating-ocean-58632.herokuapp.com/logs').then((response) => response.json()).then((responseJson) => {
      this.setState({isLoading: false, dataSource: responseJson})
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    const {showAlert} = this.state;
    if (this.state.isLoading) {
      return (<View style={{
          flex: 1,
          padding: 20
        }}>
        <ActivityIndicator/>
      </View>)
    }
    return (<View style={{
        backgroundColor: '#C7EFCF'
      }}>
      <FlatList style={{
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: '#C7EFCF',
          paddingTop: 50
        }} data={this.state.dataSource} ListFooterComponent={ <View style={{ margin: 50 }} /> } keyExtractor={this._keyExtractor} renderItem={({item}) => <Card>
          <CardItem header>
            <Text style={{
                fontFamily: 'AppleSDGothicNeo-UltraLight',
                color: '#414141',
                fontSize: 30
              }}>{item.course}</Text>
          </CardItem>
          <CardItem>
            <Body>

              <Text onPress={() => {
                  this.handleAlert(item.id)
                }} style={{
                  fontSize: 20,
                  position: 'relative',
                  left: 310,
                  bottom: 50
                }}>
                ❌
              </Text>

              <Text style={{
                  fontSize: 120,
                  position: 'absolute',
                  color: '#414141',
                  right: 50,
                  top: 1
                }}>
                □
              </Text>

              <Text style={{
                  fontFamily: 'AppleSDGothicNeo-UltraLight',
                  color: '#414141',
                  fontSize: 40,
                  position: 'absolute',
                  top: 52,
                  left: 217

                }}>
                {item.score}
              </Text>

              <Text style={{
                  fontFamily: 'AppleSDGothicNeo-UltraLight',
                  color: '#414141',
                  fontSize: 25
                }}>
                Tees: {item.tees}
              </Text>

              <Text style={{
                  fontFamily: 'AppleSDGothicNeo-UltraLight',
                  color: '#414141',
                  fontSize: 25
                }}>
                Par: {
                  item.score - item.course_handicap === 0
                    ? "Even"
                    : item.score - item.course_handicap
                }
              </Text>

              <Text style={{
                  fontFamily: 'AppleSDGothicNeo-UltraLight',
                  color: '#414141',
                  fontSize: 25
                }}>
                Putting: {(item.putts / 18).toFixed(2)}
              </Text>
              <Text style={{
                  fontFamily: 'AppleSDGothicNeo-UltraLight',
                  color: '#414141',
                  fontSize: 25
                }}>
                GIR: {item.gir}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Text style={{
                fontFamily: 'AppleSDGothicNeo-SemiBold',
                color: '#414141',
                fontSize: 24
              }}>{item.date}</Text>
          </CardItem>

        </Card>}/>

      <AwesomeAlert show={showAlert} showProgress={false} title="Are you sure you want to delete this round?" closeOnTouchOutside={true} closeOnHardwareBackPress={false} showCancelButton={true} showConfirmButton={true} cancelText="No, cancel" confirmText="Yes, delete it" confirmButtonColor="#ca3e47" onCancelPressed={() => {
          this.cancelAlert()
        }} onConfirmPressed={() => {
          this.deletePost(this.state.currentId)
        }}/>
    </View>);
  }
}

HomeScreen.navigationOptions = {
  title: 'KevinCap ⛳️'
};
