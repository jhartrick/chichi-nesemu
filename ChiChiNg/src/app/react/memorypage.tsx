import React from "react";

export default function Profile(props: { page: number[] }) {
    let result = [];
    let row = [];
    props.page.forEach((x,i) => {
        row.push(<td>{x}</td>)
        if ((i + 1)% 16==0) {
          result.push(<tr>{row}</tr>)
          row = [];
        }
    });
    result.push(<tr>{row}</tr>)
    row = [];

    return <table>{result}</table>
}
