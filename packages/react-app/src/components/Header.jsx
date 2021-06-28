import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header(props) {
  return (
    <a href="/">
      <PageHeader
        title="👨🏻‍🔬  AkitaRescue.surge.sh (STAGE)"
        subTitle={props.burnMultiplier?"You buy 1 AKITA and it burns "+props.burnMultiplier+" AKITA from Gitcoin.":"loading..."}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
