import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Artist from "./Artist";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const ArtistsPage = ({ message, filter = "" }) => {
  const [artists, setArtists] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await axiosReq.get(`/artists/?${filter}search=${query}`);
        setArtists(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchArtists();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100 d-flex justify-content-center">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p className="text-center">Most followed profiles.</p>
        <PopularProfiles />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search artist by name, location or speciality"
          />
        </Form>

        {hasLoaded ? (
          <>
            <h1>Artists</h1>
            {artists.results.length ? (
              <InfiniteScroll
                children={artists.results.map((artist) => (
                  <Artist key={artist.id} {...artist} showAll />
                ))}
                dataLength={artists.results.length}
                loader={<Asset spinner />}
                hasMore={!!artists.next}
                next={() => fetchMoreData(artists, setArtists)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
    </Row>
  );
};

export default ArtistsPage;