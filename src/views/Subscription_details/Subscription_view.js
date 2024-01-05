
import { Box, Button, Checkbox, Divider, Grid, makeStyles, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BASE_URL, PATH_SUBSCRIPTION } from "../../utils/constants";
import makeApiCall from "../../utils/makeApiCall";
import { subscriptionViewConfig } from "../../utils/display_configuration";
import moment from "moment";

const useStyles = makeStyles({
  table: {
    margin: "0 auto",
    width: "90%",
  },
  titleCell: {
    width: "35%",
    textAlign: "right",
    borderBottom: "none",
  },
  valueCell: {
    textAlign: "left",
    borderBottom: "none",
  },
});

const ViewSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const styles = useStyles();

  const [subscription, setSubscription] = useState({});

  useEffect(() => {
    if (id) {
      const fetchSubscriptionById = async () => {
        const SubscriptionResponse = await makeApiCall(
          `${BASE_URL}${PATH_SUBSCRIPTION}(${id})`
        );
        const SubscriptionJsonResp = await SubscriptionResponse.json();
        setSubscription(SubscriptionJsonResp);
      };
      fetchSubscriptionById();
    }
  }, [id]);
  return (
    <>
      {subscription && (
        <Box padding={2}>
          <Grid>
            <Grid item lg={12} xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Typography className="page-heading" variant="h5">View Subscription</Typography>
                <div  className="action-buttons">
                
                  <Button
                    onClick={() => navigate('/Subscriptions')}
                    variant="contained"
                    color="secondary"
                    size="small"
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </Grid>
            <Divider />
            <Box marginTop={2} className="form-container">
              <Grid container item lg={12} xs={12}>
                {Object.keys(subscriptionViewConfig).map((config, ind) => (
                  <>
                    <Grid item lg={5} md={5} xs={12}>
                      <Box marginTop={1}>
                        <Typography variant="h6">{config}</Typography>
                        <Table size="small" className={styles.table}>
                          <TableBody>
                            {subscriptionViewConfig[config].map(
                              ({ key, value, type }) => (
                                <TableRow key={key} className="responsive-table-row">
                                  <TableCell className={[styles.titleCell, 'row-label'].join(' ')}>
                                    <Typography variant="body1">
                                      {value}:{" "}
                                    </Typography>
                                  </TableCell>
                                  <TableCell className={[styles.valueCell, 'row-value'].join(' ')}>
                                    {
                                      type === "date" ? (
                                      <Typography variant="body1">
                                        {subscription[key] !== null &&
                                          moment.utc(subscription[key]).format(
                                            "DD-MMMM-YYYY HH:mm:ss A"
                                          )}
                                      </Typography>
                                    ) : 
                                    type === "boolean" ? (
                                      <Checkbox
                                        checked={subscription[key] || false}
                                        disabled
                                      />
                                    ) : (
                                      <Typography variant="body1">
                                        {subscription[key]}
                                      </Typography>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>
                    <Grid item lg={1} md={1} xs={false} />
                  </>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ViewSubscription;
