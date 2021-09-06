import styled from "styled-components";
import React, { } from "react";
import { Flex, CloseIcon, IconButton } from "cryption-uikit";
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Modal from "components/Modal";
import useWeb3 from "hooks/useWeb3";
import StepperContainer from 'components/Stepper/Stepper';
import CopyToClipboard from 'components/CopyToClipboard';

interface Transcation {
  amount: string;
  currency: string;
  etherTxHash: string;
  farmContract: string;
  id: string;
  isActive: boolean;
  modifiedon: string;
  pid: number;
  polygonTimestamp: string | null;
  polygonTxHash: string | null;
  status: string;
  timestamp: string;
  userAddress: string;
  timestampInms: string
  liquidity: string;
}
interface DepositModalProps {
  transcations: Transcation[];
  onDismiss?: () => void;
  isOpen: boolean;
}
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #404040;
  align-items: center;
  padding: 24px 24px;
  margin-bottom: 20px;
`;

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  font-size: 23px;
  color: #86878f;
`;
const Heading = styled.div`
  font-weight: 600;
  letter-spacing: -0.015em;
  text-transform: capitalize;
`;
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    '&:hover': {
      background: "#272935",
    },
    background: '#1E202A',
  },
});
const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      backgroundColor: '#1E202A',
      color: '#626363',
      fontWeight: 900,
      borderBottom: '1px solid #504F4F',
      fontFamily: 'Wavehaus',
      fontSize: 18
    },
    body: {
      fontSize: 14,
      background: 'transparent',
      color: '#E8E8E8',
      fontWeight: 900,
      borderBottom: '1px solid #2A2D39',
      cursor: 'pointer',
      fontFamily: 'Wavehaus',
      '&:hover': {
        background: "transparent",
      },
    },
  }),
)(TableCell);

function Row(props: { row: Transcation }) {
  const web3 = useWeb3();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  let activeIndex = 0;
  if (row.status === 'stakedOnPolygon') {
    activeIndex = 2;
  } else if (row.status === 'depositeOnEthereum') {
    activeIndex = 1
  }

  const convertSecondsToReadableString = () => {
    const utcTimeStamp = Math.floor(+new Date() / 1000);
    let seconds = utcTimeStamp - parseFloat(row.timestampInms);
    seconds = Number(seconds);
    seconds = Math.abs(seconds);

    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(seconds % (3600 * 24) / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secondDiff = Math.floor(seconds % 60);
    const parts = [];

    if (days > 0) {
      parts.push(`${days} day${days > 1 ? 's' : ''}`);
    }

    if (hours > 0) {
      parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    }

    if (minutes > 0) {
      parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
    }

    if (secondDiff > 0) {
      parts.push(`${secondDiff} sec${secondDiff > 1 ? 's' : ''}`);
    }
    return parts.join(', ');
  }
  return (
    <>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        {/* <StyledTableCell>
          <IconButtonMui aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon style={{ color: 'white' }} /> : <KeyboardArrowDownIcon style={{ color: 'white' }} />}
          </IconButtonMui>
        </StyledTableCell> */}
        <StyledTableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {`${row.etherTxHash.slice(0, 12)}...${row.etherTxHash.slice(row.etherTxHash.length - 4)}`}
            <CopyToClipboard toCopy={row.etherTxHash} />
          </div>
        </StyledTableCell>
        <StyledTableCell >{web3.utils.fromWei(row.amount, 'ether')} Eth</StyledTableCell>
        <StyledTableCell >{web3.utils.fromWei(row.liquidity, 'ether')} Eth</StyledTableCell>
        <StyledTableCell>{`${convertSecondsToReadableString()} ago`}</StyledTableCell>
      </TableRow>
      <TableRow className={classes.root}>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Transcation Status
              </Typography>
              <StepperContainer activeIndex={activeIndex} />
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
}
const TranscationsModal: React.FC<DepositModalProps> = ({
  transcations,
  isOpen,
  onDismiss,
}) => {
  return (
    <Modal
      // title={TranslateString(1068, "Stake LP tokens")}
      isOpen={isOpen}
      maxHeight={100}
      maxWidth={800}
      onDismiss={onDismiss}
    >
      <Flex flexDirection="column" width="100%">
        <ModalHeader>
          <ModalTitle>
            <Heading>All Cross Chain Transcations</Heading>
          </ModalTitle>
          <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog" size="23px">
            <CloseIcon color="#86878F" />
          </IconButton>
        </ModalHeader>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell /> */}
                <StyledTableCell>Transcation Hash</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>LP Amount</StyledTableCell>
                <StyledTableCell>Timestamp</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transcations.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {showStakerSteps ?
          <StepperContainer activeIndex={activeIndex} />
          :
          <div>

          </div>
        } */}
      </Flex>
    </Modal>
  );
};

export default TranscationsModal;
