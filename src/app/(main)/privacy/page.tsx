import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 계급도',
  description: '계급도 서비스의 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. 개인정보의 처리 목적</h2>
          <p className="text-muted-foreground leading-relaxed">
            계급도(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다.
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
            이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 서비스 부정이용 방지</li>
            <li>서비스 제공: 콘텐츠 제공, 맞춤서비스 제공</li>
            <li>고충처리: 민원인의 신원 확인, 민원사항 확인, 처리결과 통보</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. 개인정보의 처리 및 보유기간</h2>
          <p className="text-muted-foreground leading-relaxed">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>회원정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간)</li>
            <li>서비스 이용기록: 3년</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. 처리하는 개인정보의 항목</h2>
          <p className="text-muted-foreground leading-relaxed">
            회사는 다음의 개인정보 항목을 처리하고 있습니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>필수항목: 이메일 주소, 비밀번호, 닉네임</li>
            <li>자동수집항목: 접속 IP, 접속 로그, 서비스 이용 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
          <p className="text-muted-foreground leading-relaxed">
            회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며,
            정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만
            개인정보를 제3자에게 제공합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. 개인정보의 파기</h2>
          <p className="text-muted-foreground leading-relaxed">
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
            지체없이 해당 개인정보를 파기합니다. 전자적 파일 형태로 기록·저장된 개인정보는
            기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나
            소각하여 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
          <p className="text-muted-foreground leading-relaxed">
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. 개인정보 보호책임자</h2>
          <p className="text-muted-foreground leading-relaxed">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
            정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">개인정보 보호책임자</p>
            <p className="text-muted-foreground mt-2">성명: 박경근</p>
            <p className="text-muted-foreground">이메일: contact@gyegeupdo.kr</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. 개인정보처리방침의 변경</h2>
          <p className="text-muted-foreground leading-relaxed">
            이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
