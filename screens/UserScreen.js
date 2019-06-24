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
  AppRegistry,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import LineChart from "react-native-responsive-linechart";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%'
  },
  title: {
    fontSize: 24,
    margin: 30,
    alignSelf: 'center'
  }
});

const config = {
  backgroundColor: '#C7EFCF',
  line: {
    visible: true,
    strokeWidth: 1,
    strokeColor: "black"
  },
  area: {
    visible: true,
    gradientFrom: '#563873',
    gradientFromOpacity: 1,
    gradientTo: '#3A254A',
    gradientToOpacity: 0.4,
    color: 'grey'

  },
  tooltip: {
    visible: true,
    labelFontSize: 15,
    lineColor: 'black'

  },
  grid: {
    stepSize: 4,
    backgroundColor: '#C7EFCF',
    visible: false,
    strokeColor: "white",
    strokeWidth: .4
  },
  yAxis: {
    visible: true,
    labelFontSize: 20,
    labelColor: "#414141"
  },
  insetY: 1,
  insetX: 20
};

export default class UserScreen extends React.Component {

  state = {
    data: [],
    allScores: [
      0, 0
    ],
    currentHandicap: 0,
    scoringAverage: 0,
    puttingAverage: 0,
    girAverage: 0,
    lower72: 1,
    between73and79: 1,
    between80and86: 1,
    between87and92: 1,
    above92: 1,
    p1: 1,
    p2: 1,
    p3: 1,
    p4: 1,
    g1: 1,
    g2: 1,
    g3: 1,
    g4: 1
  }
  calcGir = (data) => {
    const newG1 = data.filter(green => green <= 5)
    const newG2 = data.filter(green => green > 5 && green <= 10)
    const newG3 = data.filter(green => green > 10 && green <= 15)
    const newG4 = data.filter(green => green > 16)
    this.girAverage(data)
    this.setState({g1: newG1.length, g2: newG2.length, g3: newG3.length, g4: newG4.length})
  }

  calcPutts = (data) => {
    const newP1 = data.filter(putt => putt < 2)
    const newP2 = data.filter(putt => putt >= 2 && putt <= 2.5)
    const newP3 = data.filter(putt => putt > 2.5 && putt <= 3)
    const newP4 = data.filter(putt => putt > 3)
    this.puttingAverage(data)
    this.setState({p1: newP1.length, p2: newP2.length, p3: newP3.length, p4: newP4.length})
  }

  getAverage = (data) => {
    let newData = data.map(dataPoint => (Number(dataPoint)))
    sum = newData.reduce((a, b) => (a + b));
    avg = sum / data.length;
    return avg.toFixed(2)
  }

  handicapAverage = (data) => {
    let newData = this.getAverage(data)
    this.setState({currentHandicap: newData})
  }

  scoringAverage = (data) => {
    let newData = this.getAverage(data)
    this.setState({scoringAverage: newData})
  }

  puttingAverage = (data) => {
    let newData = this.getAverage(data)
    this.setState({puttingAverage: newData})
  }

  girAverage = (data) => {
    let newData = this.getAverage(data)
    this.setState({girAverage: newData})
  }

  calc = (data) => {
    let scoreData = data.map(post => post.score)
    let girData = data.map(post => post.gir)
    let handicapData = data.map(post => (Math.max(0, (post.score - post.course_rating)) * (113 / post.slope)).toFixed(0))
    let puttData = data.map(post => (post.putts / post.holes_played).toFixed(1))
    this.setState({allScores: scoreData})
    this.handicapAverage(handicapData)
    this.calcBar(scoreData)
    this.calcPutts(puttData)
    this.calcGir(girData)
  }

  calcBar = (data) => {
    const newLower72 = data.filter(score => score <= 72)
    const newBetween73and79 = data.filter(score => score > 73 && score <= 79)
    const newBetween80and86 = data.filter(score => score > 79 && score <= 86)
    const newBetween87and92 = data.filter(score => score > 86 && score <= 92)
    const newAbove92 = data.filter(score => score > 92)
    this.scoringAverage(data)
    this.setState({lower72: newLower72.length, between73and79: newBetween73and79.length, between80and86: newBetween80and86.length, between87and92: newBetween87and92.length, above92: newAbove92.length})
  }

  componentDidMount() {
    return fetch('https://floating-ocean-58632.herokuapp.com/logs').then((response) => response.json()).then((responseJson) => {
      this.calc(responseJson)
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {

    const chart_wh = 230
    const scoreSeries = [this.state.lower72, this.state.between73and79, this.state.between80and86, this.state.between87and92, this.state.above92]
    const puttSeries = [this.state.p1, this.state.p2, this.state.p3, this.state.p4]
    const girSeries = [this.state.g1, this.state.g2, this.state.g3, this.state.g4]
    const scoreColor = ['#192E39', '#1D647F', '#578F9C', '#9EB6BF', '#F1F4F6']
    const puttColor = ['#660C1C', '#AF152C', '#F95E6B', '#F98992']
    const girColor = ['#194C02', '#3E8914', '#3DA35D', '#96E072']
    return (<ScrollView style={{
        backgroundColor: '#C7EFCF'
      }}>
      <StatusBar hidden={true}/>

      <View style={{
          paddingTop: 20,
          paddingBottom: 10,
          backgroundColor: '#dff0ea',
          position: 'relative'
        }}>

        <Text style={{
            alignSelf: 'center',
            margin: 10,
            color: '#414141',
            fontSize: 40,
            fontFamily: 'AppleSDGothicNeo-SemiBold'
          }}>👤 Kevin Ruggiero</Text>
        <Text style={{
            fontSize: 30,
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#ca3e47',
            margin: 10,
            alignSelf: 'center'
          }}>Handicap ▶︎ {this.state.currentHandicap}</Text>
        <Text style={{
            paddingTop: 20,
            fontSize: 25,
            color: '#414141',
            margin: 10,
            fontFamily: 'AppleSDGothicNeo-UltraLight'
          }}>Scoring ⇢⇢ {this.state.scoringAverage}</Text>
        <Text style={{
            margin: 10,
            color: '#414141',
            fontSize: 25,
            fontFamily: 'AppleSDGothicNeo-UltraLight'
          }}>Putting ⇢⇢ {this.state.puttingAverage}</Text>
        <Text style={{
            margin: 10,
            color: '#414141',
            fontSize: 25,
            fontFamily: 'AppleSDGothicNeo-UltraLight'
          }}>GIR ⇢⇢ {this.state.girAverage}</Text>
      </View>
      <Text style={{
          paddingTop: 20,
          fontSize: 30,
          margin: 30,
          color: '#414141',
          alignSelf: 'center',
          fontFamily: 'Thonburi'
        }}>Scoring</Text>
      <PieChart style={{
          position: 'relative',

          backgroundColor: '#C7EFCF',
          left: 20
        }} chart_wh={chart_wh} series={scoreSeries} sliceColor={scoreColor} doughnut={false} coverRadius={0.45} coverFill={'#C7EFCF'}/>
      <View style={{
          position: 'absolute',
          backgroundColor: '#C7EFCF',
          left: 280,
          bottom: 990
        }}>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#192E39'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>0 - 72</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#1D647F'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>73 - 79</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#578F9C'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>80 - 86</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#9EB6BF'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            fontSize: 18,
            color: '#414141',
          }}>87 - 92</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#F1F4F6'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            fontSize: 18,
            color: '#414141',
          }}>93 +</Text>
      </View>

      <Text style={{
          paddingTop: 20,
          fontSize: 28,
          margin: 30,
          color: '#414141',
          alignSelf: 'center',
          fontFamily: 'Thonburi'
        }}>Putts</Text>
      <PieChart style={{
          position: 'relative',
          left: 20
        }} chart_wh={chart_wh} series={puttSeries} sliceColor={puttColor} doughnut={false} coverRadius={0.45} coverFill={'#FFF'}/>
      <View style={{
          position: 'absolute',
          left: 280,
          bottom: 680
        }}>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#660C1C'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>
          0 - 1.9
        </Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#AF152C'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>2 - 2.5</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#F95E6B'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>2.6 - 3</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#F98992'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>3 +</Text>
      </View>

      <Text style={{
          paddingTop: 20,
          fontSize: 28,
          margin: 30,
          color : '#414141',
          alignSelf: 'center',
          fontFamily: 'Thonburi'
        }}>Greens in Regulation</Text>
      <PieChart style={{
          position: 'relative',
          left: 20
        }} chart_wh={chart_wh} series={girSeries} sliceColor={girColor} doughnut={false} coverRadius={0.45} coverFill={'#FFF'}/>
      <View style={{
          position: 'absolute',
          left: 280,
          bottom: 330
        }}>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#194C02'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>
          0 - 5
        </Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#3E8914'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>6 - 10</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#3DA35D'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>11 - 15</Text>
        <Icon ios='ios-square' android="md-menu" style={{
            fontSize: 25,
            color: '#96E072'
          }}/>
        <Text style={{
            fontFamily: 'AppleSDGothicNeo-UltraLight',
            color: '#414141',
            fontSize: 18
          }}>16 +</Text>
      </View>

      <View style={{
          margin: 10,
          height: 300,
          width: "95%",
          elevation: 1,
          position: "relative"
        }}>
        <Text style={{
            paddingTop: 20,
            fontSize: 28,
            color: '#414141',
            margin: 30,
            alignSelf: 'center',
            fontFamily: 'Thonburi'
          }}>Consistency</Text>
        <LineChart style={{
            flex: 1
          }} config={config} data={this.state.allScores}/>
      </View>
    </ScrollView>);
  }
}

UserScreen.navigationOptions = {
  title: 'KevinCap ⛳️'
};
