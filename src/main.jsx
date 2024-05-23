import * as React from "react";
import ReactDOM from "react-dom/client";
// import Commento from "react-commento"

import "bootstrap/dist/css/bootstrap.min.css";

import {
  Table as BTable,
  Button,
  ButtonGroup,
  Offcanvas,
} from "react-bootstrap";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData } from "./makeData";

const columns = [
  {
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: "Info",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "age",
        header: () => "Age",
        footer: (props) => props.column.id,
      },
      {
        header: "More Info",
        columns: [
          {
            accessorKey: "visits",
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "status",
            header: "Status",
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "progress",
            header: "Profile Progress",
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
];

const CONTAINER_ID = "commento";
const SCRIPT_ID = "commento-script";
const COMMENTO_URL = "https://cdn.commento.io/js/commento.js";

const Commento = ({
  id,
  cssOverride,
  autoInit,
  noFonts,
  hideDeleted,
  pageId,
}) => {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!window) {
      return;
    }
    const insertScript = (src, id, parentElement, dataAttributes) => {
      // check if the commento is emtpy if not cleanup
      console.log(document.getElementById(CONTAINER_ID).children.length);
      const script = window.document.createElement("script");
      script.async = true;
      script.src = src;
      script.id = id;
      Object.entries(dataAttributes).forEach(([key, value]) => {
        if (value === undefined) {
          return;
        }
        script.setAttribute(`data-${key}`, value.toString());
      });
      parentElement.appendChild(script);
    };
    const removeScript = (id, parentElement) => {
      console.log(document.getElementById(CONTAINER_ID).children.length);

      const script = window.document.getElementById(id);
      if (script) {
        parentElement.removeChild(script);
      }
    };
    const cleanupChildren = (htmlCollection) =>
      Array.from(htmlCollection).forEach((node) => {
        console.log(node);
        node.remove();
      });
    const document = window.document;
    let timeout, interval;
    if (document.getElementById(CONTAINER_ID)) {
      timeout = setTimeout(() => {
        insertScript(COMMENTO_URL, SCRIPT_ID, document.body, {
          "css-override": cssOverride,
          "auto-init": true,
          "no-fonts": noFonts,
          "hide-deleted": hideDeleted,
          "page-id": pageId,
        });
      }, 1);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      removeScript(SCRIPT_ID, document.body);
      // cleanupChildren(document.getElementById(CONTAINER_ID).children);
      // cleanupChildren(ref.current.children);
    };
  }, [cssOverride, hideDeleted, noFonts, pageId]);

  return <div ref={ref} key={id} id={CONTAINER_ID} />;
};

// function HowCommentoWorks() {
//   return (
//     <>
//       {/* <div id={CONTAINER_ID} /> */}
//       <ButtonGroup>
//         <Button
//           onClick={() => {
//             setTimeout(() => {
//               insertScript(COMMENTO_URL, SCRIPT_ID, document.body, {
//                 // "css-override": "cssfile",
//                 // "auto-init": true,
//                 // "no-fonts": false,
//                 // "hide-deleted": false,
//                 "page-id": "row-id-0",
//               });
//             }, 100);
//           }}
//         >
//           Insert
//         </Button>
//         <Button
//           onClick={() => {
//             removeScript(SCRIPT_ID, document.body);
//             // cleanup nodes
//             cleanupChildren(document.getElementById(CONTAINER_ID).children);
//           }}
//         >
//           Remove
//         </Button>
//       </ButtonGroup>
//     </>
//   );
// }

function App() {
  const [data, setData] = React.useState(makeData(10));
  const [rowId, setRowId] = React.useState();
  const rerender = () => setData(makeData(10));
  const [openSidebar, setOpenSidebar] = React.useState(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onTableRowClick = (id) => (e) => {
    setRowId(id);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* <div className={`p-2 ${rowId == null ? 'col-12' : 'col-8'}`} > */}
        <div className={`p-2 col-auto`}>
          <BTable striped bordered hover responsive size="sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} onClick={onTableRowClick(row.id)}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </BTable>

          {rowId?.toString()}
          <div className="h-4">
            <button onClick={() => rerender()} className="border p-2">
              Rerender
            </button>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 20,
            width: 50,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
          }}
          className="btn btn-secondary"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          {openSidebar ? ">" : "<"}
        </div>

        {/* <HowCommentoWorks /> */}

        <Offcanvas
          show={openSidebar}
          onHide={() => setOpenSidebar(!openSidebar)}
          placement="end"
          backdrop={false}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
            {rowId !== undefined ? (
              <Commento
                key={`row-id-${rowId}`}
                pageId={`row-id-${rowId}`}
                id={`row-id-${rowId}`}
                // cssOverride?: string | undefined;
                // autoInit?: boolean | undefined;
                // noFonts={false}
                // noFonts?: boolean | undefined;
                // hideDeleted?: boolean | undefined;
              />
            ) : null}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
