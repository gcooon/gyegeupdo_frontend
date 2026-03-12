import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 계급도',
  description: '계급도 서비스의 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
          <p className="text-muted-foreground leading-relaxed">
            이 약관은 계급도(이하 &quot;회사&quot;)가 제공하는 계급도 서비스(이하 &quot;서비스&quot;)의
            이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등 기본적인 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>&quot;서비스&quot;란 회사가 제공하는 제품 평가, 순위, 커뮤니티 등 모든 서비스를 의미합니다.</li>
            <li>&quot;회원&quot;이란 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여받은 자를 말합니다.</li>
            <li>&quot;계급도&quot;란 제품 또는 브랜드에 대한 등급(S, A, B, C, D)을 매긴 순위표를 의미합니다.</li>
            <li>&quot;콘텐츠&quot;란 회원이 서비스에 게시한 모든 글, 이미지, 계급도 등을 의미합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
          <p className="text-muted-foreground leading-relaxed">
            ① 이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.<br />
            ② 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.<br />
            ③ 회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제4조 (회원가입)</h2>
          <p className="text-muted-foreground leading-relaxed">
            ① 회원가입은 이용자가 약관의 내용에 동의하고, 회원가입 양식에 필요한 정보를 기입하여
            회원가입을 신청하면 회사가 이를 승낙함으로써 체결됩니다.<br />
            ② 회사는 다음 각 호에 해당하는 경우 회원가입을 거절하거나 취소할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>타인의 정보를 도용한 경우</li>
            <li>허위 정보를 기재한 경우</li>
            <li>기타 회원으로 등록하는 것이 서비스 운영에 현저히 지장이 있다고 판단되는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제5조 (회원의 의무)</h2>
          <p className="text-muted-foreground leading-relaxed">
            회원은 다음 행위를 하여서는 안 됩니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사가 금지한 정보의 송신 또는 게시</li>
            <li>회사 또는 제3자의 저작권 등 지적재산권에 대한 침해</li>
            <li>회사 또는 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>외설 또는 폭력적인 메시지, 화상, 음성 등의 게시</li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제6조 (서비스의 제공 및 변경)</h2>
          <p className="text-muted-foreground leading-relaxed">
            ① 회사는 회원에게 아래와 같은 서비스를 제공합니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>제품 및 브랜드 계급도 정보 제공</li>
            <li>커뮤니티 서비스 (게시판, 댓글, 투표 등)</li>
            <li>나만의 계급도 만들기</li>
            <li>제품 추천 퀴즈</li>
            <li>기타 회사가 개발하거나 제휴를 통해 제공하는 서비스</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            ② 회사는 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 내용을 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제7조 (콘텐츠의 저작권)</h2>
          <p className="text-muted-foreground leading-relaxed">
            ① 회원이 서비스에 게시한 콘텐츠의 저작권은 해당 회원에게 있습니다.<br />
            ② 회사는 서비스 운영, 홍보 등의 목적으로 회원의 콘텐츠를 사용할 수 있습니다.<br />
            ③ 회사는 회원이 게시한 콘텐츠가 타인의 저작권을 침해하는 경우 해당 콘텐츠를 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제8조 (서비스 이용 제한)</h2>
          <p className="text-muted-foreground leading-relaxed">
            회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우,
            서비스 이용을 경고, 일시정지, 영구정지 등으로 단계적으로 제한할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제9조 (면책조항)</h2>
          <p className="text-muted-foreground leading-relaxed">
            ① 회사는 천재지변, 전쟁 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.<br />
            ② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.<br />
            ③ 회사는 회원이 게시한 콘텐츠의 정확성, 신뢰성에 대해 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제10조 (분쟁해결)</h2>
          <p className="text-muted-foreground leading-relaxed">
            ① 회사와 회원 간에 발생한 분쟁에 관한 소송은 대한민국 법을 적용합니다.<br />
            ② 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">부칙</h2>
          <p className="text-muted-foreground leading-relaxed">
            이 약관은 2024년 1월 1일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
