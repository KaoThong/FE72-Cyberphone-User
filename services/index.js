function Service() {
    this.getListProductApi = function () {
      /**
       * Promise:
       *      - Pending (chờ)
       *      - Resolve (thành công)
       *      - Reject (thất bại)
       */
      return axios({
        url: "https://62bc4dcbeff39ad5ee223a09.mockapi.io/api/Products",
        method: "GET",
      });
    };
  }