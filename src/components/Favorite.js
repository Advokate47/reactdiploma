import React, { Component } from 'react';
import '../css/style-favorite.css';
import SitePath from './SitePath';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeImg: this.props.images
    };
  };

  handleClick = (event) => this.props.func(event, this.props.id);

  itemArrowClickLeft = (event) => {
    event.preventDefault();
    const tempDataArr = [...this.state.activeImg];
    const firstImg = tempDataArr.shift();
    tempDataArr.push(firstImg);
    this.setState({
      activeImg: tempDataArr
    });
  };

  itemArrowClickRight = (event) => {
    event.preventDefault();
    const tempDataArr = [...this.state.activeImg];
    const lastImg = tempDataArr.pop();
    tempDataArr.unshift(lastImg);
    this.setState({
      activeImg: tempDataArr
    });
  };

  render() {
    const { id, title, isActive, brand, price, oldPrice } = this.props;
    return (
      <Link className="item-list__item-card item" to={`/productCard/${id}`}>
        <div className="item-pic">
          <img className="item-pic-img" src={this.state.activeImg[0]} alt={title} />
          <div className='product-catalogue__product_favorite' onClick={this.handleClick}>
            <p className={isActive ? 'product-catalogue__product_favorite-chosen' : 'product-catalogue__product_favorite-icon'} ></p>
          </div>
          <div className="arrow arrow_left" onClick={this.itemArrowClickLeft} ></div>
          <div className="arrow arrow_right" onClick={this.itemArrowClickRight} ></div>
        </div>
        <div className="item-desc">
          <h4 className="item-name">{title}</h4>
          <p className="item-producer">Производитель: <span className="producer">{brand}</span></p>
          <p className="item-price">{price}</p>
          {oldPrice && <p className="item-price old-price"><s>{oldPrice}</s></p>}
        </div>
      </Link>
    );
  };
};

class Favorite extends Component {
  constructor(props) {
    super(props);
    const favoriteKeyData = localStorage.favoriteKey ? JSON.parse(localStorage.favoriteKey) : [];
    this.state = {
      favoriteData: favoriteKeyData,
      page: 1,
      pages: Math.ceil(favoriteKeyData.length / 12),
      sortParam: 'date'
    };
  };

  setSortByFilter = (event) => {
    const sortValue = event.currentTarget.value;
    this.setState({
      sortParam: `${sortValue}`
    });
    if (sortValue === "price") {
      const sortedItems = [...this.state.favoriteData].sort((a, b) => a.price - b.price);
      this.setState({
        favoriteData: sortedItems
      });
    } else if (sortValue === "brand") {
      const sortedItems = [...this.state.favoriteData].sort((a, b) => a.brand - b.brand);
      this.setState({
        favoriteData: sortedItems
      });
    } else {
      this.setState({
        favoriteData: localStorage.favoriteKey ? JSON.parse(localStorage.favoriteKey) : []
      });
    };
  };

  pageClick = (page) => (event) => {
    event.preventDefault();
    this.setState({
      page: page
    });
  };

  arrowClick = (value) => (event) => {
    event.preventDefault();
    const newPageNumber = this.state.page + value;
    if (newPageNumber < 1 || newPageNumber > this.state.pages) return;
    this.setState({
      page: newPageNumber
    });
  };

  favoriteRemove = (event, itemID) => {
    event.preventDefault();
    const favoriteFilter = this.state.favoriteData.filter((item) => itemID === item.id);
    const tempfavoriteData = [...this.state.favoriteData];
    if (favoriteFilter.length > 0 && favoriteFilter[0].id === itemID) {
      const removeData = this.state.favoriteData.indexOf(favoriteFilter[0]);
      tempfavoriteData.splice(removeData, 1);
      this.setState({
        favoriteData: tempfavoriteData,
        isActive: false,
        pages: Math.ceil(tempfavoriteData.length / 12)
      });
      if (tempfavoriteData.length < 13) {
        this.setState({
          page: 1
        });
      };
      const serialTempData = JSON.stringify(tempfavoriteData);
      localStorage.setItem("favoriteKey", serialTempData);
    };
  };

  GetNoun = (number, one, two, five, none) => {
    number = Math.abs(number);
    number %= 100;
    if (!number) {
      return none;
    };
    if (number >= 5 && number <= 20) {
      return five;
    };
    number %= 10;
    if (number === 1) {
      return one;
    };
    if (number >= 2 && number <= 4) {
      return two;
    };
    return five;
  };

  render() {
    const { favoriteData, sortParam, page, pages } = this.state;
    return (
      <div className="wrapper wrapper_favorite">
        <SitePath mainUrlparam={{ to: '/favorite', title: 'Избранное' }} />
        <main className="product-catalogue product-catalogue_favorite">
          <section className="product-catalogue__head product-catalogue__head_favorite">
            <div className="product-catalogue__section-title">
              <h2 className="section-name">В вашем избранном</h2>
              <span className="amount amount_favorite">{favoriteData.length > 0 && favoriteData.length} {this.GetNoun(favoriteData.length, 'товар', 'товара', 'товаров', 'нет товаров')}</span>
            </div>
            <div className="product-catalogue__sort-by">
              <p className="sort-by">Сортировать</p>
              <select
                name="sortBy"
                value={sortParam}
                onChange={this.setSortByFilter}
                id="sorting">
                <option value="price">по цене</option>
                <option value="brand">по производителю</option>
                <option value="date">по дате добавления</option>
              </select>
            </div>
          </section>
          <section className="product-catalogue__item-list product-catalogue__item-list_favorite">
            {favoriteData.length > 0 && favoriteData.slice((page - 1) * 12, page * 12).map(items =>
              <ListItem key={items.id}
                id={items.id}
                title={items.title}
                images={items.images}
                brand={items.brand}
                price={items.price}
                oldPrice={items.oldPrice}
                func={this.favoriteRemove}
              />)}
          </section>
          {<Pagination page={page} pages={pages} pageClick={this.pageClick} arrowClick={this.arrowClick} />}
        </main>
      </div>
    );
  };
};

export default Favorite;