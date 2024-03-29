import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import NewsItem from './NewsItem'
import Spinner from '../Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=>{

    const [articles, setArticles]=useState([])
    const [loading, setLoading]=useState(true)
    const [page, setPage]=useState(1)
    const [totalResults, setTotalResults]=useState(0)


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)}-Newsify`;
        updateNews();
    // eslint-disable-next-line
    },[])

    const updateNews= async ()=> {
        props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setLoading(true);
        props.setProgress(30);
        let data = await fetch(url);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100)
    }

    // const handlePrevClick = async () => {
    //     setPage(page-1);
    //     updateNews();
    // }

    // const handleNextClick = async () => {

    //     setPage(page+1);
    //     updateNews();
    // }

    const fetchMoreData = async () => {

        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=f90887c4b0314faab645100dcbcd076d&page=${page}&pageSize=${props.pageSize}`;
        setPage(page+1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults)
    };


        return (
            <>
                <h1 className="text-center" style={{ margin: "90px 35px 0px" }}>Newsify-Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner/>}


                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>

                </InfiniteScroll>

                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Prev</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>

                </div> */}

            </>
        )
}

News.defaultProps={
    country:'in',
    pageSize:8,
    category:'general',
}
News.propTypes = {
    country: PropTypes.string,
    page: PropTypes.number,
    category: PropTypes.string
}

export default News
