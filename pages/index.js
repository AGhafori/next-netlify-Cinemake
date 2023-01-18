import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Image,
  TouchableWithoutFeedback
} from "react-native";

export default class animations extends Component {
  state = {
    activeImage: null,
    animation: new Animated.Value(0),
    position: new Animated.ValueXY(),
    size: new Animated.ValueXY()
  };

  UNSAFE_componentWillMount() {
    this._gridImages = {};
  }

  handleOpenImage = (index) => {
    this._gridImages[index]
      .getNode()
      .measure((x, y, width, height, pageX, pageY) => {
        (this._x = pageX), (this._y = pageY);
        this._width = width;
        this._height = height;

        this.state.position.setValue({
          x: pageX,
          y: pageY
        });

        this.state.size.setValue({
          x: width,
          y: height
        });

        this.setState(
          {
            activeImage: images[index],
            activeIndex: index
          },
          () => {
            this._viewImage.measure(
              (tX, tY, tWidth, tHeight, tPageX, tPageY) => {
                Animated.parallel([
                  Animated.spring(this.state.position.x, {
                    toValue: tPageX
                  }),
                  Animated.spring(this.state.position.y, {
                    toValue: tPageY
                  }),
                  Animated.spring(this.state.size.x, {
                    toValue: tWidth
                  }),
                  Animated.spring(this.state.size.y, {
                    toValue: tHeight
                  }),
                  Animated.spring(this.state.animation, {
                    toValue: 1
                  })
                ]).start();
              }
            );
          }
        );
      });
  };

  handleClose = () => {
    Animated.parallel([
      Animated.timing(this.state.position.x, {
        toValue: this._x,
        duration: 250
      }),
      Animated.timing(this.state.position.y, {
        toValue: this._y,
        duration: 250
      }),
      Animated.timing(this.state.size.x, {
        toValue: this._width,
        duration: 250
      }),
      Animated.timing(this.state.size.y, {
        toValue: this._height,
        duration: 250
      }),
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 250
      })
    ]).start(() => {
      this.setState({
        activeImage: null
      });
    });
  };

  render() {
    const animatedContentTranslate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0]
    });

    const animtedContentStyles = {
      opacity: this.state.animation,
      transform: [
        {
          translateY: animatedContentTranslate
        }
      ]
    };

    const animatedClose = {
      opacity: this.state.animation
    };

    const activeImageStyle = {
      width: this.state.size.x,
      height: this.state.size.y,
      top: this.state.position.y,
      left: this.state.position.x
    };

    const activeIndexStyle = {
      opacity: this.state.activeImage ? 0 : 1
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Logo</Text>
          <h1>Something descritpion</h1>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.grid}>
            {images.map((src, index) => {
              const style =
                index === this.state.activeIndex ? activeIndexStyle : undefined;

              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => this.handleOpenImage(index)}
                >
                  <Animated.Image
                    source={src}
                    style={[styles.gridImage, style]}
                    resizeMode="cover"
                    ref={(image) => (this._gridImages[index] = image)}
                  />
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeImage ? "auto" : "none"}
        >
          <View
            style={styles.topContent}
            ref={(image) => (this._viewImage = image)}
          >
            <Animated.Image
              key={this.state.activeImage}
              source={this.state.activeImage}
              resizeMode="cover"
              style={[styles.viewImage, activeImageStyle]}
            />
          </View>
          <Animated.View
            style={[styles.contentBar, animtedContentStyles]}
            ref={(content) => (this._content = content)}
          >
            <Text style={styles.title}>Pretty Image from Unsplash</Text>
          </Animated.View>
          <TouchableWithoutFeedback onPress={this.handleClose}>
            <Animated.View style={[styles.close, animatedClose]}>
              <Image
                style={styles.closeText}
                source={require("./Images/exit.jpg")}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.footer}>
          <Text>Logo</Text>
          <Text>something something footer</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  header: {
    height: "20%",
    backgroundColor: "black",
    color: "white"
  },
  footer: {
    height: "10%",
    justifyContent: "bottom",
    backgroundColor: "black",
  },
  content: {
    marginLeft: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: "80%",
    width: "90%",
    backgroundColor: "black",
    //margin: 5,
    
  },
  gridImage: {
    width: "20%",
    height: 200,
    backgroundColor: "black",
    margin: 5,
  },
  viewImage: {
    width: null,
    height: null,
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0
  },
  topContent: {
    flex: 1,
  },
  contentBar: {
    backgroundColor: "black",
    
  },
  title: {
    //fontSize: 28
  },
  close: {
    position: "absolute",
    top: 20,
    right: 20
  },
  closeText: {
    backgroundColor: "transparent",
    width: 20,
    height: 20,
    color: "#FFF"
  }
});

const images = [
  { uri: "http://i.imgur.com/ELeNsEk.jpg" },
  { uri: "http://i.imgur.com/nRzunT5.jpg" },
  { uri: "http://i.imgur.com/mLsfCaX.jpg" },
  { uri: "http://i.imgur.com/LWNij55.jpg" },
  { uri: "http://i.imgur.com/Qp3EbEL.jpg" },
  { uri: "http://i.imgur.com/fHspYxM.jpg" },
  { uri: "http://i.imgur.com/iJNUXyy.jpg" },
  { uri: "http://i.imgur.com/9Nq6ecH.jpg" },
  { uri: "http://i.imgur.com/dWjRmlv.jpg" },
  { uri: "http://i.imgur.com/wJ6GfX2.jpg" },
  { uri: "http://i.imgur.com/kyprcIX.jpg" },
  { uri: "http://i.imgur.com/B5gbx7T.jpg" },
  { uri: "http://i.imgur.com/aEwp6No.jpg" },
  { uri: "http://i.imgur.com/Ophf7gS.jpg" },
  { uri: "http://i.imgur.com/fbj7fPr.jpg" },
  { uri: "http://i.imgur.com/KP7sqd3.jpg" },
  { uri: "http://i.imgur.com/LBKLcn8.jpg" }
];
