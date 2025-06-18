// Manual.jsx: 이미지와 완전히 동일하게 매뉴얼 등록 화면 구현
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { FaFlask } from 'react-icons/fa';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 0 3rem 0;
`;

const MainTitle = styled.h1`
  font-size: 2.3rem;
  font-weight: 900;
  margin: 0 0 2.2rem 0;
  text-align: left;
  letter-spacing: -1px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.7rem 0;
  text-align: left;
`;

const Desc = styled.p`
  color: #444;
  font-size: 1rem;
  margin: 0 0 2.2rem 0;
  text-align: left;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  background: ${({ active }) => (active ? '#234c36' : '#e9ecef')};
  color: ${({ active }) => (active ? '#fff' : '#234c36')};
  border: none;
  border-radius: 6px 6px 0 0;
  padding: 0.7rem 2.2rem;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  letter-spacing: -0.5px;
`;

const UploadSection = styled.section`
  background: #ecece7;
  border-radius: 6px;
  padding: 2.5rem 2rem 2.5rem 2rem;
  margin-bottom: 2.5rem;
`;

const UploadBox = styled.div`
  border: 1.5px dashed #b5b5b5;
  border-radius: 6px;
  background: #fff;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  margin: 0 auto;
  max-width: 520px;
`;

const UploadTitle = styled.div`
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 1.2rem;
`;

const UploadOr = styled.div`
  color: #222;
  font-size: 1rem;
  margin-bottom: 1.2rem;
`;

const FileLabel = styled.label`
  display: inline-block;
  background: #fff;
  color: #234c36;
  border: 1.5px solid #234c36;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #234c36;
    color: #fff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadInfo = styled.div`
  color: #888;
  font-size: 0.95rem;
  margin-top: 1.2rem;
  text-align: left;
  line-height: 1.6;
`;

const MyManualSection = styled.section`
  margin-top: 3.5rem;
`;

const MyManualTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.7rem 0;
  text-align: left;
`;

const MyTabRow = styled(TabRow)`
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  background: #fff;
  border: 1.5px solid #b5b5b5;
  border-radius: 6px;
  padding: 0.5rem 0;
  list-style: none;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid #eaeaea;
  font-size: 1.05rem;
  &:last-child { border-bottom: none; }
`;

const ListLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const ListIcon = styled.span`
  color: #234c36;
  font-size: 1.3rem;
`;

const ListTitleText = styled.span`
  color: #234c36;
  font-weight: 700;
`;

const ListDate = styled.span`
  color: #888;
  font-size: 0.98rem;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2.5rem 0 2.5rem 0;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1.5px solid #d0d7d9;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
`;

const DynamicButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  background: #234c36;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #183324;
  }
`;

function Manual() {
  // 탭 상태
  const [tab, setTab] = useState('실험');
  const [myTab, setMyTab] = useState('실험');
  const [input, setInput] = useState('');
  const fileInputRef = useRef();

  // 더미 매뉴얼 데이터 (이미지와 동일)
  const manuals = [
    { name: '고효율 촉매 및 전극 개발 실험 매뉴얼', date: '25/05/17 13:43:25' },
    { name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼', date: '25/05/17 13:43:25' },
  ];

  // 탭별 placeholder
  const placeholders = {
    '실험': '실험명을 입력해주세요.',
    '장비': '장비명을 입력해주세요.',
    '화학물질': '화학물질명을 입력해주세요.'
  };

  return (
    <PageWrapper>
      <MainTitle>매뉴얼</MainTitle>
      <SectionTitle>매뉴얼 등록</SectionTitle>
      <Desc>PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.</Desc>
      <TabRow>
        {['실험', '장비', '화학물질'].map((t) => (
          <Tab key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Tab>
        ))}
      </TabRow>
      {/* 실험 탭일 때만 업로드, 장비/화학물질은 입력창/버튼 */}
      {tab === '실험' ? (
        <UploadSection>
          <UploadBox>
            <UploadTitle>첨부파일 파일 넣기</UploadTitle>
            <UploadOr>또는</UploadOr>
            <FileLabel htmlFor="file-upload">파일 선택</FileLabel>
            <FileInput id="file-upload" type="file" ref={fileInputRef} />
          </UploadBox>
          <UploadInfo>
            · 파일 업로드는 PDF 형식만 가능하며, 용량은 30MB 이하로 제한됩니다.<br />
            · 파일 업로드 시 바로 분석이 시작됩니다.
          </UploadInfo>
        </UploadSection>
      ) : (
        <InputRow>
          <Input
            placeholder={placeholders[tab]}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <DynamicButton>입력</DynamicButton>
        </InputRow>
      )}
      <MyManualSection>
        <MyManualTitle>내 매뉴얼</MyManualTitle>
        <MyTabRow>
          {['실험', '장비', '화학물질'].map((t) => (
            <Tab key={t} active={myTab === t} onClick={() => setMyTab(t)}>{t}</Tab>
          ))}
        </MyTabRow>
        <List>
          {manuals.map((m, i) => (
            <ListItem key={i}>
              <ListLeft>
                <ListIcon><FaFlask /></ListIcon>
                <ListTitleText>{m.name}</ListTitleText>
              </ListLeft>
              <ListDate>{m.date}</ListDate>
            </ListItem>
          ))}
        </List>
      </MyManualSection>
    </PageWrapper>
  );
}

export default Manual; 