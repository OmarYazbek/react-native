import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";

// Pencil Icon: In the RenderCampsite component, find the heart Icon component for marking a favorite. Beneath it, add a second Icon component using the Font-Awesome "pencil" name. Give it the color of '#5637DD' and the raised and reverse props, along with an onPress event handler prop set like this:
// onPress={() => props.onShowModal()}
// Wrap both the heart and pencil Icon components inside a single View component.

const mapStateToProps = state => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite: campsiteId => postFavorite(campsiteId),
  postComment: (campsiteId, author, text, rating) =>
    postComment(campsiteId, author, text, rating),
};

function RenderCampsite(props) {
  const { campsite } = props;
  if (campsite) {
    return (
      <Card
        featuredTitle={campsite.name}
        image={{ uri: baseUrl + campsite.image }}
      >
        <Text style={{ margin: 10 }}>{campsite.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            raised
            onPress={() =>
              props.favorite
                ? console.log("Already set as a favorite")
                : props.markFavorite()
            }
          />
          <Icon
            name="pencil"
            type="font-awesome"
            color="#5637DD"
            raised
            reverse
            onPress={() => props.onShowModal()}
          />
        </View>
      </Card>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          readonly
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
        />
        <Text
          style={{ fontSize: 12 }}
        >{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleComment = campsiteId => {
    this.props.postComment(
      campsiteId,
      this.state.author,
      this.state.text,
      this.state.rating
    );
    this.toggleModal();
  };

  resetForm = () => {
    this.setState({
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    });
  };

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  static navigationOptions = {
    title: "Campsite Information",
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter(
      campsite => campsite.id === campsiteId
    )[0];
    const comments = this.props.comments.comments.filter(
      comment => comment.campsiteId === campsiteId
    );
    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={comments} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue={this.state.rating}
              imageSize={40}
              onFinishRating={rating => this.setState({ rating: rating })}
              style={{ paddingVertical: 10 }}
            />
            <Input
              placeholder="Author"
              leftIcon="user-o"
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={author => this.setState({ author: author })}
              value={this.state.author}
            />
            <Input
              placeholder="Comments"
              leftIcon="comment-o"
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={text => this.setState({ text: text })}
              value={this.state.text}
            />
            <View>
              <Button
                title="Submit"
                color="#5637DD"
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.resetForm();
                }}
              />
            </View>

            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                title="Cancel"
                style={{ color: "#808080" }}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
