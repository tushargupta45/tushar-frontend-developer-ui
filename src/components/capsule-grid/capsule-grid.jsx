import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableHead,
  TextField,
} from "@mui/material";
import "./capsule-grid.css";
import { getCapsules } from "../../service/capsule-service";
import { formatDate } from "../../utils/date-utils";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function CapsuleGrid() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [searchByDropDown, setSearchByDropDown] = useState("");
  const [searchByText, setSearchByText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filtersUpdated, setFiltersUpdated] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [clearBtnLoading, setClearBtnLoading] = useState(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    pageIndex > 0 ? Math.max(0, (1 + pageIndex) * pageSize - totalCount) : 0;

  const handleChangePage = (event, newPage) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  const prepareQuery = () => {
    const offset = pageIndex * pageSize;
    let query = "";

    query = `limit=${pageSize}&offset=${offset}`;
    if (searchByDropDown) {
      query += `&${searchByDropDown}=${searchByText}`;
    }
    if (statusFilter) {
      query += `&status=${statusFilter}`;
    }
    return query;
  };

  useEffect(() => {
    setRows([]);
    (async () => {
      try {
        setLoading(true);
        const query = prepareQuery();
        const { data } = await getCapsules(query);
        const rowData = data.results.map((row) => {
          return {
            capsule_serial: row.capsule_serial ?? "---",
            details: row.details ?? "---",
            landings: row.landings ?? "---",
            original_launch: formatDate(row.original_launch),
            reuse_count: row.reuse_count ?? "---",
            status: row.status ?? "---",
            type: row.type ?? "---",
          };
        });
        setRows(rowData);
        setTotalCount(data.count ? parseInt(data.count) : 0);
        setLoading(false);
        setSubmitBtnLoading(false);
        setClearBtnLoading(false);
      } catch (err) {
        console.log(`Error: ${err}`);
        setLoading(false);
        setSubmitBtnLoading(false);
        setClearBtnLoading(false);
      }
    })();
  }, [pageIndex, pageSize, filtersUpdated]);

  const handleFiltersSubmit = () => {
    if (searchByDropDown === "" && searchByText === "" && statusFilter === "") {
      return;
    }
    setPageIndex(0);
    setPageSize(10);
    setSubmitBtnLoading(true);
    setFiltersUpdated(!filtersUpdated);
  };

  const handleFiltersClear = () => {
    setStatusFilter("");
    setSearchByText("");
    setSearchByDropDown("");
    setPageIndex(0);
    setPageSize(10);
    setClearBtnLoading(true);
    setFiltersUpdated(!filtersUpdated);
  };

  return (
    <>
      <div className="filter-section">
        <FormControl className="search-by-dropdown">
          <InputLabel id="demo-simple-select-label">Search by </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchByDropDown}
            label="Search by"
            onChange={(e) => {
              setSearchByDropDown(e.target.value);
            }}
          >
            <MenuItem value={""}>Please select</MenuItem>
            <MenuItem value={"capsule_id"}>ID</MenuItem>
            <MenuItem value={"capsule_serial"}>Serial No.</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className="search-field"
          id="outlined-basic"
          variant="outlined"
          value={searchByText}
          onChange={(e) => {
            setSearchByText(e.target.value);
          }}
          disabled={searchByDropDown ? false : true}
        />

        <FormControl className="status-dropdown">
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <MenuItem value={""}>Please select</MenuItem>
            <MenuItem value={"active"}>Active</MenuItem>
            <MenuItem value={"unknown"}>Unknown</MenuItem>
            <MenuItem value={"retired"}>Retired</MenuItem>
          </Select>
        </FormControl>
        <Button
          className="submit-btn"
          variant="contained"
          onClick={() => {
            handleFiltersSubmit();
          }}
        >
          {submitBtnLoading ? (
            <CircularProgress className="submit-btn-spinner" size={20} />
          ) : (
            "SUBMIT"
          )}
        </Button>
        <Button
          className="submit-btn"
          variant="contained"
          onClick={() => {
            handleFiltersClear();
          }}
        >
          {clearBtnLoading ? (
            <CircularProgress className="submit-btn-spinner" size={20} />
          ) : (
            "CLEAR"
          )}
        </Button>
      </div>
      {!loading ? (
        <TableContainer component={Paper} className="table-body">
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={totalCount}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="header" className="header-row">
                <TableCell component="th" style={{ width: 120 }} scope="row">
                  SERIAL
                </TableCell>
                <TableCell style={{ width: 120 }} align="right">
                  STATUS
                </TableCell>
                <TableCell style={{ width: 120 }} align="right">
                  LAUNCH DATE
                </TableCell>
                <TableCell style={{ width: 120 }} align="right">
                  LANDINGS
                </TableCell>
                <TableCell style={{ width: 120 }} align="right">
                  TYPE
                </TableCell>
                <TableCell style={{ width: 120 }} align="right">
                  DETAILS
                </TableCell>
                <TableCell style={{ width: 120 }} align="right">
                  NO. OF TIMES USED
                </TableCell>
              </TableRow>
              {rows.map((row) => (
                <TableRow key={row.capsule_serial}>
                  <TableCell style={{ width: 120 }} component="th" scope="row">
                    {row.capsule_serial}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="right">
                    {row.status}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="right">
                    {row.original_launch}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="right">
                    {row.landings}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="right">
                    {row.type}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="right">
                    {row.details}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="right">
                    {row.reuse_count}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={totalCount}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <div className="grid-spinner-container">
          <CircularProgress className="grid-spinner" />
        </div>
      )}
    </>
  );
}

export default CapsuleGrid;
