import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useParams } from 'react-router-dom';

import PageWrapper from '../components/PageWrapper';
import { colors } from '../config/theme';
import { getProjectAsync } from '../mocks/projects';
import { PulseLoader } from 'react-spinners';

const Project = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    getProject();
  }, []);

  const getProject = async () => {
    setProject(await getProjectAsync());
    setLoading(false);
  };

  return (
    <PageWrapper>
      <Wrapper>
        {!loading && project && (
          <>
            <div className="column">
              <CodeMirror
                className="codemirror"
                options={{
                  mode: '6502',
                  theme: 'ayu-mirage',
                  lineNumbers: true
                }}
                onBeforeChange={(editor, data, value) => {
                  setProject({ ...project, code: data });
                }}
                value={project.code}
              />
            </div>
            <div className="column">adkjkjldjfdkf</div>
          </>
        )}
        {loading && (
          <PulseLoader
            size={16}
            loading={true}
            color={colors.cool_grey_050}
            className="loader"
          />
        )}
        {!loading && !project && (
          <div className="empty">This project does not seem to exist.</div>
        )}
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  margin: 64px 128px;
  width: calc(100% - 2 * 128px);
  height: calc(100vh - 2 * 48px - 2 * 64px);
  display: flex;
  justify-content: space-around;

  .column {
    width: 50%;
  }

  .codemirror,
  .codemirror > div {
    height: 100% !important;
  }
`;

export default Project;
