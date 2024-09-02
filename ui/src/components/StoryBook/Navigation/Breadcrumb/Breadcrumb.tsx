import React from 'react';
import './Breadcrumb.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type BreadcrumbProps = {
  pathnames: string[];
  breadcrumbNameMap: { [key: string]: string };
  color?: string;
  colorEnd?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Breadcrumbs = ({
  pathnames = [],
  breadcrumbNameMap = {},
  color,
  colorEnd
}: BreadcrumbProps) => {
  return (
    <nav className="navMain">
      <ol className="listOrder">
        <li>
          <a href="/">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill={color}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.70236 0.0997329C7.8806 -0.0346262 8.1263 -0.0345719 8.30448 0.099866L15.5498 5.56653C15.5632 5.5766 15.576 5.58733 15.5883 5.59868C15.833 5.82516 15.9803 6.13778 15.9992 6.47071C15.9997 6.48013 16 6.48956 16 6.499V14.849L16 14.851C15.9974 15.4855 15.4834 15.9991 14.8489 16.001L14.8473 16.001H10.5C10.2239 16.001 10 15.7771 10 15.501V12.001C10 10.8964 9.10457 10.001 8 10.001C6.89543 10.001 6 10.8964 6 12.001V15.499C6 15.7751 5.77614 15.999 5.5 15.999H1.152L1.15047 15.999C0.51589 15.9971 0.00194001 15.4831 2.34445e-06 14.8485L0 14.847V6.499C0 6.48979 0.000254313 6.48059 0.000762661 6.47139C0.0192031 6.13791 0.166795 5.82472 0.412249 5.59821C0.424418 5.58699 0.437137 5.57637 0.450359 5.5664L7.70236 0.0997329ZM1.0771 6.34625C1.03308 6.39257 1.00587 6.45245 1 6.51624V14.846C1.00053 14.9303 1.06872 14.9985 1.15299 14.999H5V12.001C5 10.3441 6.34315 9.001 8 9.001C9.65685 9.001 11 10.3441 11 12.001V15.001H14.8463C14.9309 15.0005 14.9993 14.9321 15 14.8476V6.51665C14.994 6.45262 14.9667 6.39253 14.9225 6.34595L8.00319 1.12525L1.0771 6.34625Z"
                fill={color}
              />
            </svg>
          </a>
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.390386 1.09642C0.0294231 1.46762 0.037721 2.06115 0.40892 2.42212L5.11662 7L0.40892 11.5779C0.0377211 11.9388 0.0294233 12.5324 0.390386 12.9036C0.751349 13.2748 1.34488 13.2831 1.71608 12.9221L6.8601 7.91994C6.86027 7.91978 6.86044 7.91961 6.86061 7.91945C7.10671 7.68024 7.25 7.35005 7.25 7C7.25 6.64971 7.10651 6.31931 6.8601 6.08006L1.71608 1.07789C1.34488 0.716923 0.751349 0.725221 0.390386 1.09642Z"
              fill="#262626"
            />
          </svg>
        </li>

        {/* Verifica se há mais de 3 itens e substitui todos os anteriores ao índice 3 por uma ellipse */}
        {pathnames.length > 3 && (
          <div className="divEllipse">
            <div className="backgroundEllipse">
              <a href={`/${pathnames.slice(3)[0]}`}>
                <FontAwesomeIcon
                  icon={'ellipsis'}
                  style={{ width: 16, height: 16 }}
                  color="#646464"
                />
              </a>
            </div>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill={color}
              xmlns="http://www.w3.org/2000/svg"
              className="ellipseArrow"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.390386 1.09642C0.0294231 1.46762 0.037721 2.06115 0.40892 2.42212L5.11662 7L0.40892 11.5779C0.0377211 11.9388 0.0294233 12.5324 0.390386 12.9036C0.751349 13.2748 1.34488 13.2831 1.71608 12.9221L6.8601 7.91994C6.86027 7.91978 6.86044 7.91961 6.86061 7.91945C7.10671 7.68024 7.25 7.35005 7.25 7C7.25 6.64971 7.10651 6.31931 6.8601 6.08006L1.71608 1.07789C1.34488 0.716923 0.751349 0.725221 0.390386 1.09642Z"
                fill="#262626"
              />
            </svg>
          </div>
        )}

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const last = index === pathnames.length - 1;

          if (pathnames.length > 3 && index <= 3 && !last) {
            return null; // Evita renderizar os elementos anteriores ao índice 3
          }

          return (
            <li key={to}>
              <a href={to}>
                {/* <Label label={breadcrumbNameMap[to]} color={last ? colorEnd : color} /> */}
                <span style={{ color: last ? colorEnd : color }}>
                  {breadcrumbNameMap[to]}
                </span>
              </a>
              {!last && (
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.390386 1.09642C0.0294231 1.46762 0.037721 2.06115 0.40892 2.42212L5.11662 7L0.40892 11.5779C0.0377211 11.9388 0.0294233 12.5324 0.390386 12.9036C0.751349 13.2748 1.34488 13.2831 1.71608 12.9221L6.8601 7.91994C6.86027 7.91978 6.86044 7.91961 6.86061 7.91945C7.10671 7.68024 7.25 7.35005 7.25 7C7.25 6.64971 7.10651 6.31931 6.8601 6.08006L1.71608 1.07789C1.34488 0.716923 0.751349 0.725221 0.390386 1.09642Z"
                    fill="#262626"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
