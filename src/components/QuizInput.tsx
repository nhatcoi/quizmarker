import React, { useState } from 'react';
import { Question, QuizMode } from '../types/Quiz';
import { parseQuizText } from '../utils/quizParser';
import { formatTextWithGemini } from '../services/geminiService';

interface QuizInputProps {
  onQuizCreated: (questions: Question[], mode: QuizMode) => void;
}

const QuizInput: React.FC<QuizInputProps> = ({ onQuizCreated }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [selectedMode, setSelectedMode] = useState<QuizMode>('test');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const questions = parseQuizText(inputText);
      if (questions.length === 0) {
        alert('Không thể tạo câu hỏi từ text này. Vui lòng kiểm tra lại format.');
        return;
      }
      
      onQuizCreated(questions, selectedMode);
    } catch (error) {
      alert('Có lỗi xảy ra khi parse câu hỏi. Vui lòng kiểm tra lại format.');
      console.error('Parse error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatText = async () => {
    if (!inputText.trim()) {
      alert('Vui lòng nhập text trước khi format.');
      return;
    }

    setIsFormatting(true);
    
    try {
      const formattedText = await formatTextWithGemini(inputText);
      setInputText(formattedText);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi format text.');
      console.error('Format error:', error);
    } finally {
      setIsFormatting(false);
    }
  };

  const sampleText = `1. AWS Pricing, Elasticity, Agility, High Availability, Fault Tolerance, Scalability, Hybrid Architecture
Phát biểu nào sau đây mô tả tốt nhất mô hình định giá Pay-As-You-Go của AWS?
A. Với AWS, bạn thay thế các chi phí trả trước lớn bằng các khoản thanh toán biến đổi thấp.
B. Với AWS, bạn thay thế chi phí trả trước thấp bằng các khoản thanh toán biến đổi lớn.
C. Với AWS, bạn thay thế chi phí trả trước thấp bằng các khoản thanh toán cố định lớn.
D. Với AWS, bạn thay thế chi phí trả trước lớn bằng các khoản thanh toán cố định thấp.
Đáp án đúng: A
Mô hình triển khai nào sau đây cho phép khách hàng chuyển đổi hoàn toàn chi phí CNTT vốn (capex) của họ thành chi phí vận hành (opex)?
A. On-premises.
B. Cloud.
C. Hybrid.
D. PaaS.
Đáp án đúng: B
Đâu là một lợi thế của việc sử dụng AWS Cloud so với giải pháp on-premises truyền thống?
A. Người dùng không cần phải dự đoán về nhu cầu dung lượng trong tương lai.
B. Chi phí cố định hàng tháng thấp hơn.
C. Người dùng có thể kiểm soát hoàn toàn cơ sở hạ tầng vật lý.
D. Có quyền truy cập vật lý vào các trung tâm dữ liệu cloud.
Đáp án đúng: A
So với chi phí trong các trung tâm dữ liệu truyền thống và ảo hóa, AWS có:
A. Chi phí biến đổi lớn hơn và chi phí trả trước lớn hơn.
B. Chi phí sử dụng cố định và chi phí trả trước thấp hơn.
C. Chi phí biến đổi thấp hơn và chi phí trả trước lớn hơn.
D. Chi phí biến đổi thấp hơn và chi phí trả trước thấp hơn.
Đáp án đúng: D
Khách hàng được hưởng lợi như thế nào từ quy mô kinh tế khổng lồ của Amazon?
A. Giảm giá định kỳ do hiệu quả hoạt động của Amazon.
B. Các loại instance Amazon EC2 mới cung cấp phần cứng mới nhất.
C. Khả năng scale up và scale down khi cần.
D. Tăng độ tin cậy trong phần cứng cơ bản của các instance Amazon EC2.
Đáp án đúng: A
Sự giảm giá liên tục của định giá AWS Cloud là do:
A. Định giá pay-as-you-go.
B. Cơ sở hạ tầng global của AWS.
C. Quy mô kinh tế.
D. Định giá lưu trữ reserved.
Đáp án đúng: C
Điều chỉnh dung lượng tính toán một cách linh hoạt để giảm chi phí là sự triển khai của nguyên tắc thực hành tốt nhất nào của AWS Cloud?
A. Xây dựng bảo mật ở mọi layer.
B. Song song hóa các task.
C. Triển khai tính elasticity.
D. Áp dụng kiến trúc monolithic.
Đáp án đúng: C
Điều gì làm cho AWS kinh tế hơn các trung tâm dữ liệu truyền thống đối với các ứng dụng có khối lượng công việc tính toán thay đổi?
A. Các instance Amazon EC2 được tính phí theo tháng.
B. Khách hàng giữ toàn quyền truy cập quản trị vào các instance Amazon EC2 của họ.
C. Các instance Amazon EC2 có thể được khởi chạy on-demand khi cần.
D. Khách hàng có thể chạy vĩnh viễn đủ các instance để xử lý khối lượng công việc cao điểm.
Đáp án đúng: C
Công nghệ nào cho phép dung lượng tính toán tự điều chỉnh khi tải thay đổi?
A. Load balancing.
B. Tự động failover.
C. Round robin.
D. Auto Scaling.
Đáp án đúng: D
Lợi ích nào của AWS Cloud hỗ trợ việc khớp cung cấp tài nguyên với nhu cầu khối lượng công việc thay đổi?
A. High availability.
B. Global reach.
C. Elasticity.
D. Chi phí biến đổi thấp hơn do quy mô kinh tế khổng lồ.
Đáp án đúng: C
Tính elasticity của AWS Cloud giúp khách hàng tiết kiệm chi phí so với các nhà cung cấp dịch vụ lưu trữ truyền thống. Khách hàng AWS có thể làm gì để hưởng lợi từ tính elasticity của AWS Cloud? (Chọn HAI)
A. Triển khai tài nguyên của bạn trên nhiều Availability Zones.
B. Sử dụng Amazon EC2 Auto Scaling.
C. Triển khai tài nguyên của bạn trong một region khác.
D. Sử dụng Elastic Load Balancing.
E. Sử dụng Serverless Computing bất cứ khi nào có thể.
Đáp án đúng: B, E
Khả năng tự động điều chỉnh các instance Amazon EC2 dựa trên nhu cầu là một ví dụ về khái niệm nào trong giá trị cốt lõi của AWS Cloud?
A. High availability.
B. Data durability.
C. Fault tolerance.
D. Elasticity.
Đáp án đúng: D
Một giải pháp có khả năng hỗ trợ sự phát triển về user, traffic hoặc kích thước dữ liệu mà không làm giảm hiệu suất phù hợp với nguyên tắc kiến trúc cloud nào?
A. Suy nghĩ song song.
B. Triển khai tính elasticity.
C. Tách rời các component của bạn.
D. Thiết kế để chịu lỗi.
Đáp án đúng: B
Đâu là một ví dụ về tính agility trong AWS Cloud?
A. Truy cập vào nhiều loại instance.
B. Truy cập vào các managed service.
C. Sử dụng consolidated billing để tạo một hóa đơn.
D. Thời gian thu nhận tài nguyên tính toán mới giảm.
Đáp án đúng: D
Tính agility của AWS Cloud là gì?
A. AWS cho phép bạn cung cấp tài nguyên trong vài phút.
B. AWS cho phép bạn cấp quyền cho user một cách nhanh chóng.
C. AWS cho phép bạn sao chép toàn bộ cơ sở hạ tầng của mình trong vài giây.
D. AWS cho phép bạn trả tiền cho những gì bạn sử dụng, theo tháng.
Đáp án đúng: A
Những lợi ích ngay lập tức của việc sử dụng AWS Cloud là gì? (Chọn HAI)
A. Tăng nhân sự CNTT.
B. Chi phí vốn được thay thế bằng chi phí biến đổi.
C. User kiểm soát cơ sở hạ tầng.
D. Tăng tính agility.
E. AWS chịu trách nhiệm về bảo mật trong cloud.
Đáp án đúng: B, D
Ưu điểm của việc triển khai ứng dụng trên nhiều Availability Zones?
A. Ứng dụng sẽ có tính high availability vì nó có thể chịu được sự gián đoạn dịch vụ ở một Availability Zone.
B. Có ít rủi ro dịch vụ bị lỗi hơn nếu một thảm họa tự nhiên gây gián đoạn dịch vụ ở một Region AWS cụ thể.
C. Sẽ có vùng phủ sóng tốt hơn vì các Availability Zones cách xa nhau về mặt địa lý và có thể phục vụ một khu vực rộng lớn hơn.
D. Sẽ giảm độ trễ của ứng dụng, cải thiện trải nghiệm user.
Đáp án đúng: A
Một hệ thống trong AWS Cloud được thiết kế để chịu được sự cố của một hoặc nhiều component. Đây là ví dụ về điều gì?
A. Elasticity.
B. High Availability.
C. Scalability.
D. Agility.
Đáp án đúng: B
Định nghĩa của "Fault tolerance" là gì?
A. Khả năng của một ứng dụng để điều chỉnh sự phát triển mà không thay đổi thiết kế.
B. Mức độ và tốc độ môi trường của một ứng dụng có thể khôi phục dữ liệu bị mất.
C. Mức độ an toàn của ứng dụng của bạn.
D. Khả năng dự phòng sẵn có của các component của ứng dụng.
Đáp án đúng: D
Nguyên tắc "thiết kế để chịu lỗi và không có gì sẽ thất bại" rất quan trọng khi thiết kế kiến trúc AWS Cloud của bạn. Điều nào sau đây sẽ giúp tuân thủ nguyên tắc này? (Chọn HAI)
A. Multi-factor authentication.
B. Availability Zones.
C. Elastic Load Balancing.
D. Penetration testing.
E. Vertical scaling.
Đáp án đúng: B, C
Điều nào sau đây là một nguyên tắc thiết kế kiến trúc cloud của AWS?
A. Triển khai các single point of failure.
B. Implement loose coupling.
C. Triển khai thiết kế monolithic.
D. Triển khai vertical scaling.
Đáp án đúng: B
Phân phối khối lượng công việc trên nhiều Availability Zones hỗ trợ nguyên tắc thiết kế kiến trúc cloud nào?
A. Triển khai automation.
B. Thiết kế cho agility.
C. Thiết kế để chịu lỗi.
D. Triển khai tính elasticity.
Đáp án đúng: C
Để đạt được tính high availability, tài nguyên tính toán nên được cấp phát trên bao nhiêu Availability Zones tối thiểu?
A. Tối thiểu một.
B. Tối thiểu hai.
C. Tối thiểu ba.
D. Tối thiểu bốn hoặc hơn.
Đáp án đúng: B
Một công ty đang phát triển một ứng dụng web quan trọng trên AWS và bảo mật của ứng dụng là ưu tiên hàng đầu. Dịch vụ AWS nào sau đây sẽ cung cấp các khuyến nghị tối ưu hóa bảo mật hạ tầng?
A. AWS Shield.
B. AWS Management Console.
C. AWS Secrets Manager.
D. AWS Trusted Advisor.
Đáp án đúng: D
Trong các mô hình điện toán cloud sau đây, mô hình nào KHÔNG thuộc về AWS?
A. PaaS.
B. IaaS.
C. SaaS.
D. NaaS.
Đáp án đúng: D
Sử dụng Amazon EC2 thuộc mô hình điện toán cloud nào sau đây?
A. IaaS & SaaS.
B. IaaS.
C. SaaS.
D. PaaS.
Đáp án đúng: B
Amazon Elastic Beanstalk cung cấp gì?
A. Một công cụ tính toán cho Amazon ECS.
B. Một giải pháp lưu trữ file có thể mở rộng để sử dụng với AWS và máy chủ on-premises.
C. Một dịch vụ cơ sở dữ liệu NoSQL.
D. Một giải pháp PaaS để tự động hóa triển khai ứng dụng.
Đáp án đúng: D
Dịch vụ nào sau đây thuộc danh mục nền tảng serverless của AWS?
A. Amazon EMR.
B. Elastic Load Balancing.
C. AWS Lambda.
D. AWS Mobile Hub.
Đáp án đúng: C
Các dịch vụ nào sau đây là serverless? (Chọn HAI)
A. Amazon EC2.
B. AWS Lambda.
C. Amazon Elasticsearch Service.
D. Amazon DynamoDB.
E. Amazon Redshift.
Đáp án đúng: B, D
Dịch vụ nào của AWS là dịch vụ tính toán được quản lý hoàn toàn?
A. Amazon EC2.
B. Amazon SWF.
C. Amazon Aurora.
D. AWS Lambda.
Đáp án đúng: D
Dịch vụ nào của AWS cung cấp tính toán và dung lượng? (Chọn HAI)
A. AWS Lambda.
B. Amazon ECS.
C. AWS CodeDeploy.
D. Amazon Glacier.
E. AWS Organizations.
Đáp án đúng: A, B
Lợi ích của việc sử dụng các managed service của AWS, chẳng hạn như Amazon ElastiCache và Amazon RDS là gì?
A. Chúng yêu cầu khách hàng phải giám sát và thay thế các instance bị lỗi.
B. Chúng có hiệu suất tốt hơn các dịch vụ do khách hàng quản lý.
C. Chúng đơn giản hóa việc vá lỗi và cập nhật hệ điều hành cơ bản.
D. Chúng không yêu cầu khách hàng phải tối ưu hóa loại instance hoặc lựa chọn kích thước.
Đáp án đúng: C
Dịch vụ nào của AWS thuộc danh mục nền tảng serverless?
A. Amazon EC2, Amazon S3, Amazon Athena.
B. Amazon Kinesis, Amazon SQS, Amazon EMR.
C. AWS Step Functions, Amazon DynamoDB, Amazon SNS.
D. Amazon Athena, Amazon Cognito, Amazon EC2.
Đáp án đúng: C
Khi sử dụng AWS Lambda, trách nhiệm của khách hàng là gì?
A. Cấu hình hệ điều hành.
B. Quản lý ứng dụng.
C. Quản lý nền tảng.
D. Mã hóa code.
Đáp án đúng: B
Máy chủ web chạy trên Amazon EC2 truy cập một ứng dụng cũ đang chạy trong trung tâm dữ liệu của công ty. Thuật ngữ nào sẽ mô tả mô hình này?
A. Cloud-native.
B. Partner network.
C. Hybrid architecture.
D. IaaS.
Đáp án đúng: C
Điều gì có nghĩa là một user triển khai hybrid cloud architecture trên AWS?
A. Tất cả tài nguyên chạy bằng cơ sở hạ tầng on-premises.
B. Một số tài nguyên chạy on-premises và một số chạy trong trung tâm dữ liệu.
C. Tất cả tài nguyên chạy trong AWS Cloud.
D. Một số tài nguyên chạy on-premises và một số chạy trong AWS Cloud.
Đáp án đúng: D
Dịch vụ nào cung cấp hybrid storage service cho phép các ứng dụng on-premises sử dụng liền mạch lưu trữ cloud?
A. Amazon Glacier.
B. AWS Snowball.
C. AWS Storage Gateway.
D. Amazon EBS.
Đáp án đúng: C
Các dịch vụ nào có thể được sử dụng trên các kiến trúc hybrid cloud của AWS? (Chọn HAI)
A. Amazon Route 53.
B. Virtual Private Gateway.
C. Classic Load Balancer.
D. Auto Scaling.
E. Amazon CloudWatch default metrics.
Đáp án đúng: A, B
Các dịch vụ nào của AWS cung cấp cách để mở rộng kiến trúc on-premises sang AWS Cloud? (Chọn HAI)
A. Amazon EBS.
B. AWS Direct Connect.
C. Amazon CloudFront.
D. AWS Storage Gateway.
E. Amazon Connect.
Đáp án đúng: B, D
Dịch vụ nào của AWS sẽ cung cấp kết nối network trong hybrid architecture bao gồm AWS Cloud?
A. Amazon VPC.
B. AWS Direct Connect.
C. AWS Directory Service.
D. Amazon API Gateway.
Đáp án đúng: A
Một công ty đã phân phối khối lượng công việc của mình trên cả AWS Cloud và một số máy chủ on-premises. Đây là loại kiến trúc nào?
A. Virtual Private Network.
B. Virtual Private Cloud.
C. Hybrid cloud.
D. Private cloud.
Đáp án đúng: C
Những tùy chọn kết nối nào có thể được sử dụng để xây dựng hybrid cloud architecture? (Chọn HAI)
A. AWS Artifact.
B. AWS Cloud9.
C. AWS Direct Connect.
D. AWS CloudTrail.
E. AWS VPN.
Đáp án đúng: C, E
2. IAM (Identity and Access Management)
Điều gì mà "Nguyên tắc đặc quyền tối thiểu" đề cập đến?
A. Bạn chỉ nên cấp cho user những quyền họ cần khi họ cần và không hơn.
B. Tất cả user IAM nên có ít nhất các quyền cần thiết để truy cập các dịch vụ cốt lõi của AWS.
C. Tất cả user IAM đáng tin cậy nên có quyền truy cập vào bất kỳ dịch vụ AWS nào trong tài khoản AWS tương ứng.
D. User IAM không nên được cấp bất kỳ quyền nào; để giữ tài khoản của bạn an toàn.
Đáp án đúng: A
IAM user phải cung cấp gì để tương tác với các dịch vụ AWS bằng cách sử dụng AWS CLI?
A. Access keys.
B. Secret token.
C. User ID.
D. Username và password.
Đáp án đúng: A
Tổ chức có một số lượng lớn nhân viên kỹ thuật vận hành cơ sở hạ tầng AWS Cloud của họ. AWS cung cấp gì để giúp tổ chức họ thành các group và sau đó gán các quyền thích hợp cho mỗi group?
A. IAM roles.
B. IAM users.
C. IAM user groups.
D. AWS Organizations.
Đáp án đúng: C
Các yếu tố xác thực nào cần thiết để có quyền truy cập chương trình vào tài khoản AWS? (Chọn HAI)
A. Access key ID.
B. Primary key.
C. Secret access key.
D. User ID.
E. Secondary key.
Đáp án đúng: A, C
Để tăng cường bảo mật cho việc truy cập AWS Management Console, bạn nên làm gì? (Chọn HAI)
A. AWS Secrets Manager.
B. AWS Certificate Manager.
C. AWS MFA.
D. Security groups.
E. Password policy.
Đáp án đúng: C, E
Khả năng tăng cường bảo mật cho việc đăng nhập tài khoản AWS là gì? (Chọn HAI)
A. Cấu hình AWS Certificate Manager.
B. Bật multi-factor authentication (MFA).
C. Sử dụng Amazon Cognito để quản lý truy cập.
D. Cấu hình strong password policy.
E. Bật AWS Organizations.
Đáp án đúng: B, D
Tính năng nào của AWS cung cấp một cấp độ bảo mật bổ sung bên trên cơ chế xác thực mặc định bằng username và password?
A. Encrypted keys.
B. Email verification.
C. AWS KMS.
D. AWS MFA.
Đáp án đúng: D
Tính năng nào của IAM có thể được sử dụng để cấp quyền tạm thời cho tài nguyên AWS của bạn?
A. IAM Users.
B. Key Pair.
C. IAM Roles.
D. IAM Groups.
Đáp án đúng: C
Hai điểm khác biệt chính giữa IAM user và IAM role trong AWS là gì? (Chọn HAI)
A. Một IAM user được liên kết duy nhất với một người, tuy nhiên một role được dùng để có thể được assumed bởi bất kỳ ai cần nó.
B. Một IAM user có các thông tin xác thực vĩnh viễn liên quan đến nó, tuy nhiên một role có các thông tin xác thực tạm thời liên quan đến nó.
C. IAM user tiết kiệm chi phí hơn IAM role.
D. Một role được liên kết duy nhất với một người, tuy nhiên một IAM user được dùng để có thể được assumed bởi bất kỳ ai cần nó.
E. Một IAM user có các thông tin xác thực tạm thời liên quan đến nó, tuy nhiên một role có các thông tin xác thực vĩnh viễn liên quan đến nó.
Đáp án đúng: A, B
Bạn có thể sử dụng gì để gán quyền trực tiếp cho một IAM user?
A. IAM Identity.
B. IAM Group.
C. IAM Role.
D. IAM Policy.
Đáp án đúng: D
Các kiểu identity nào của AWS IAM? (Chọn HAI)
A. AWS Resource Groups.
B. IAM Policies.
C. IAM Roles.
D. IAM Users.
E. AWS Organizations.
Đáp án đúng: C, D
AWS IAM cung cấp dịch vụ gì để tạo và quản lý user và group AWS, và cung cấp cho họ quyền truy cập an toàn vào tài nguyên AWS mà không tính phí?
A. AWS Direct Connect.
B. Amazon Connect.
C. AWS IAM.
D. AWS Firewall Manager.
Đáp án đúng: C
Khi cấp quyền cho các ứng dụng chạy trên các instance Amazon EC2, điều nào sau đây được coi là thực hành tốt nhất?
A. Tạo access keys IAM mới mỗi khi bạn ủy quyền.
B. Lưu trữ các thông tin xác thực AWS cần thiết trực tiếp trong mã ứng dụng.
C. Sử dụng temporary security credentials (IAM roles) thay vì access keys dài hạn.
D. Không làm gì; các ứng dụng chạy trên các instance Amazon EC2 không cần quyền để tương tác với các dịch vụ hoặc tài nguyên AWS khác.
Đáp án đúng: C
Các biện pháp bảo mật nào sau đây bảo vệ quyền truy cập vào tài khoản AWS? (Chọn HAI)
A. Bật AWS CloudTrail.
B. Cấp quyền truy cập least privilege cho user IAM.
C. Tạo một user IAM và chia sẻ với nhiều nhà phát triển và user.
D. Bật Amazon CloudFront.
E. Kích hoạt multi-factor authentication (MFA) cho user có đặc quyền.
Đáp án đúng: B, E
Loại thiết bị MFA nào khách hàng có thể sử dụng để bảo vệ tài nguyên AWS của họ?
A. AWS CloudHSM.
B. U2F security key.
C. AWS Access Keys.
D. AWS Key Pair.
Đáp án đúng: B
3. Network
Dịch vụ nào của AWS sẽ cung cấp kết nối network trong hybrid architecture bao gồm AWS Cloud?
A. Amazon VPC.
B. AWS Direct Connect.
C. AWS Directory Service.
D. Amazon API Gateway.
Đáp án đúng: A
Những tùy chọn kết nối nào có thể được sử dụng để xây dựng hybrid cloud architecture? (Chọn HAI)
A. AWS Artifact.
B. AWS Cloud9.
C. AWS Direct Connect.
D. AWS CloudTrail.
E. AWS VPN.
Đáp án đúng: C, E
Tính năng nào sau đây có thể được cấu hình thông qua AWS Management Console của Amazon VPC? (Chọn HAI)
A. Amazon CloudFront distribution.
B. Amazon Route 53.
C. Security Groups.
D. Subnets.
E. Elastic Load Balancing.
Đáp án đúng: C, D
Bạn đang làm việc trên hai dự án yêu cầu cấu hình network hoàn toàn khác nhau. Dịch vụ hoặc tính năng AWS nào sẽ cho phép bạn cô lập tài nguyên và cấu hình network?
A. Internet gateway.
B. Virtual Private Cloud.
C. Security group.
D. Amazon CloudFront.
Đáp án đúng: B
Dịch vụ AWS nào cung cấp một mạng ảo dedicated cho tài khoản AWS của bạn?
A. AWS VPN.
B. AWS Subnets.
C. AWS Dedicated Hosts.
D. Amazon VPC.
Đáp án đúng: D
Đâu là mục đích của việc có một internet gateway trong VPC?
A. Để tạo một kết nối VPN đến VPC.
B. Để cho phép giao tiếp giữa VPC và Internet.
C. Để áp đặt các giới hạn băng thông lên lưu lượng internet.
D. Để cân bằng tải lưu lượng từ Internet trên các instance Amazon EC2.
Đáp án đúng: B
Tính năng Amazon VPC nào cho phép user ghi lại thông tin về lưu lượng IP đến các instance Amazon EC2?
A. Security group.
B. Elastic network interface.
C. Network ACL.
D. VPC Flow Logs.
Đáp án đúng: D
Dịch vụ nào của AWS cung cấp network ACLs vào và ra để củng cố kết nối bên ngoài đến Amazon EC2?
A. AWS IAM.
B. Amazon Connect.
C. Amazon VPC.
D. Amazon API Gateway.
Đáp án đúng: C
Các component nào sau đây là của Amazon VPC? (Chọn HAI)
A. Objects.
B. Subnets.
C. Buckets.
D. Internet gateways.
E. Access keys.
Đáp án đúng: B, D
Dịch vụ AWS hoặc tính năng nào có thể được sử dụng để bắt giữ thông tin về lưu lượng truy cập đến và đi trong một cơ sở hạ tầng AWS VPC?
A. AWS Config.
B. VPC Flow Logs.
C. AWS Trusted Advisor.
D. AWS CloudTrail.
Đáp án đúng: B
Điều nào sau đây được sử dụng để kiểm soát lưu lượng network trong AWS? (Chọn HAI)
A. Network ACLs.
B. Key pairs.
C. Access keys.
D. IAM policies.
E. Security Groups.
Đáp án đúng: A, E
Các dịch vụ nào của AWS được định nghĩa là global thay vì regional? (Chọn HAI)
A. Amazon Route 53.
B. Amazon EC2.
C. Amazon S3.
D. Amazon CloudFront.
E. Amazon DynamoDB.
Đáp án đúng: A, D
Dịch vụ nào cung cấp DNS trong AWS Cloud?
A. Route 53.
B. AWS Config.
C. Amazon CloudFront.
D. Amazon EMR.
Đáp án đúng: A
Dịch vụ nào của AWS cung cấp một CDN an toàn, nhanh chóng và hiệu quả về chi phí, phân phối dữ liệu, video và ứng dụng cho user toàn cầu với độ trễ thấp và tốc độ truyền tải cao?
A. AWS CloudFormation.
B. AWS Direct Connect.
C. Amazon CloudFront.
D. Amazon Pinpoint.
Đáp án đúng: C
AWS đã tạo ra một số lượng lớn Edge Locations như một phần của cơ sở hạ tầng global của mình. Điều nào sau đây KHÔNG phải là lợi ích của việc sử dụng Edge Locations?
A. Edge Locations được CloudFront sử dụng để lưu trữ các phản hồi gần đây nhất.
B. Edge Locations được CloudFront sử dụng để cải thiện trải nghiệm user cuối khi tải lên file.
C. Edge Locations được CloudFront sử dụng để phân phối lưu lượng truy cập trên nhiều instance nhằm giảm độ trễ.
D. Edge Locations được CloudFront sử dụng để phân phối nội dung cho user toàn cầu với độ trễ thấp.
Đáp án đúng: C
Dịch vụ AWS hoặc tính năng nào có thể tăng cường bảo mật network bằng cách chặn các yêu cầu từ một network cụ thể cho một ứng dụng web trên AWS? (Chọn HAI)
A. AWS WAF.
B. AWS Trusted Advisor.
C. AWS Direct Connect.
D. AWS Organizations.
E. Network ACLs.
Đáp án đúng: A, E
4. Compute, Storage, Database
Đâu là một ví dụ về horizontal scaling trong AWS Cloud?
A. Thay thế một instance EC2 hiện có bằng một instance lớn hơn, mạnh hơn.
B. Tăng dung lượng tính toán của một instance EC2 duy nhất để đáp ứng nhu cầu ngày càng tăng của một ứng dụng.
C. Thêm dung lượng RAM vào một instance EC2.
D. Thêm nhiều instance EC2 cùng kích thước để xử lý lưu lượng tăng lên.
Đáp án đúng: D
Bạn muốn chạy một ứng dụng hỏi đáp chỉ trong một ngày (không bị gián đoạn), bạn nên sử dụng tùy chọn mua Amazon EC2 nào?
A. Reserved Instances.
B. Spot Instances.
C. Dedicated Instances.
D. On-Demand Instances.
Đáp án đúng: D
Bạn đang làm việc trên một dự án liên quan đến việc tạo hình thu nhỏ của hàng triệu hình ảnh. Thời gian hoạt động nhất quán không phải là vấn đề, và không yêu cầu xử lý liên tục. Tùy chọn mua EC2 nào sẽ hiệu quả nhất về chi phí?
A. Reserved Instances.
B. On-Demand Instances.
C. Dedicated Instances.
D. Spot Instances.
Đáp án đúng: D
Loại tùy chọn mua Amazon EC2 nào nên được sử dụng để đáp ứng các yêu cầu về giấy phép phần mềm mỗi lõi?
A. Dedicated Hosts.
B. On-Demand Instances.
C. Spot Instances.
D. Reserved Instances.
Đáp án đúng: A
Tùy chọn giá Amazon EC2 nào điều chỉnh dựa trên cung và cầu của các instance EC2?
A. On-Demand Instances.
B. Reserved Instances.
C. Spot Instances.
D. Convertible Reserved Instances.
Đáp án đúng: C
Lợi ích của định giá On-Demand Amazon EC2 là:
A. Khả năng đấu thầu để có chi phí theo giờ thấp hơn.
B. Thanh toán phí hàng ngày bất kể thời gian sử dụng.
C. Chỉ trả tiền cho thời gian sử dụng.
D. Trả trước cho các instance và trả phí theo giờ thấp hơn.
Đáp án đúng: C
Công ty đang chạy khối lượng công việc không bị gián đoạn trong ba năm. Loại cấu trúc giá nào sẽ cung cấp giải pháp hiệu quả nhất về chi phí?
A. Amazon EC2 Spot Instances.
B. Amazon EC2 Dedicated Instances.
C. Amazon EC2 On-Demand Instances.
D. Amazon EC2 Reserved Instances.
Đáp án đúng: D
Loại mô hình định giá Reserved Instance (RI) nào cung cấp mức tiết kiệm trung bình cao nhất so với định giá On-Demand?
A. Standard RI pricing, no upfront, one-year.
B. Convertible RI pricing, all upfront, one-year.
C. Standard RI pricing, all upfront, three-year.
D. Convertible RI pricing, no upfront, three-year.
Đáp án đúng: C
Loại mô hình định giá Reserved Instance (RI) nào có thể thay đổi các thuộc tính của RI miễn là việc trao đổi dẫn đến việc tạo ra các RI có giá trị bằng hoặc lớn hơn?
A. Dedicated RIs.
B. Scheduled RIs.
C. Convertible RIs.
D. Standard RIs.
Đáp án đúng: C
Khi nào một công ty nên xem xét sử dụng Amazon EC2 Spot Instances? (Chọn HAI)
A. Đối với các ứng dụng không bị gián đoạn.
B. Đối với khối lượng công việc có trạng thái.
C. Đối với các ứng dụng không thể bị gián đoạn.
D. Đối với các ứng dụng chịu lỗi linh hoạt.
E. Đối với các ứng dụng không phải sản xuất.
Đáp án đúng: D, E
Instance Amazon EC2 chạy trong 3 giờ, 5 phút và 6 giây. Khách hàng sẽ được tính phí trong bao lâu?
A. 3 giờ, 5 phút.
B. 3 giờ, 5 phút, và 6 giây.
C. 3 giờ, 6 phút.
D. 4 giờ.
Đáp án đúng: B
Những yếu tố nào sẽ ảnh hưởng đến giá phải trả cho một instance EC2? (Chọn HAI)
A. Instance type.
B. Availability Zone nơi instance được cấp phát.
C. Load balancer.
D. Số lượng buckets.
E. Số lượng private IPs.
Đáp án đúng: A, B
Loại tùy chọn mua Amazon EC2 nào có thể cung cấp chiết khấu lên tới 90%?
A. Reserved Instances.
B. On-Demand Instances.
C. Dedicated Hosts.
D. Spot Instances.
Đáp án đúng: D
Instance Amazon EC2 nào cho phép user khởi chạy một instance được cấu hình sẵn?
A. Amazon EBS.
B. Amazon Machine Image (AMI).
C. Amazon EC2 Systems Manager.
D. Amazon AppStream 2.0.
Đáp án đúng: B
Tùy chọn giá nào sẽ giảm thiểu chi phí trong khi đảm bảo tài nguyên tính toán luôn có sẵn?
A. Dedicated Hosts.
B. On-Demand Instances.
C. Spot Instances.
D. Reserved Instances.
Đáp án đúng: D
Tùy chọn mua nào tiết kiệm chi phí nhất để chạy một tập hợp các instance EC2 phải luôn có sẵn trong hai tháng?
A. On-Demand Instances.
B. Spot Instances.
C. Reserved Instances - All Upfront.
D. Reserved Instances - No Upfront.
Đáp án đúng: A
Đối với các instance Amazon EC2, AWS tính phí dựa trên:
A. Theo giây, với tối thiểu một phút đối với Linux và các loại instance được chọn.
B. Theo giờ, với tối thiểu một ngày.
C. Theo phút, với tối thiểu một giờ.
D. Theo ngày, với tối thiểu một tháng.
Đáp án đúng: A
Công ty bạn đã dành nhiều thời gian để cấu hình một instance Amazon EC2 mới triển khai. Sau khi khối lượng công việc tăng lên, công ty quyết định cấp phát một instance EC2 khác với cấu hình giống hệt. Làm thế nào công ty có thể đạt được điều này?
A. Bằng cách tạo một mẫu AWS Config từ instance cũ và khởi chạy một instance mới từ đó.
B. Bằng cách tạo một EBS Snapshot của instance cũ.
C. Bằng cách cài đặt Aurora trên EC2 và khởi chạy một instance mới từ đó.
D. Bằng cách tạo một AMI từ instance cũ và khởi chạy một instance mới từ đó.
Đáp án đúng: D
Công ty bạn đang chạy một cơ sở dữ liệu Oracle tự quản lý trực tiếp trên Amazon EC2 cho cơ sở dữ liệu ổn định của mình. Công ty muốn giảm chi phí tính toán. Tùy chọn nào công ty nên sử dụng để tối đa hóa tiết kiệm trong thời hạn 3 năm?
A. EC2 Dedicated Instances.
B. EC2 Spot Instances.
C. EC2 Reserved Instances.
D. EC2 On-Demand Instances.
Đáp án đúng: C
Bạn có thể sử dụng dịch vụ AWS nào để chạy phần mềm cơ sở dữ liệu quan hệ tùy chỉnh?
A. Amazon EC2.
B. Amazon Cognito.
C. Amazon RDS.
D. Amazon Inspector.
Đáp án đúng: A
Dịch vụ nào cung cấp lưu trữ object, cung cấp quyền truy cập thời gian thực vào các object đó, và cung cấp khả năng versioning và lifecycle?
A. Amazon Glacier.
B. AWS Storage Gateway.
C. Amazon S3.
D. Amazon EBS.
Đáp án đúng: C
Dịch vụ lưu trữ nào có thể được sử dụng như một lựa chọn chi phí thấp để lưu trữ các trang web tĩnh?
A. Amazon Glacier.
B. Amazon DynamoDB.
C. Amazon EFS.
D. Amazon S3.
Đáp án đúng: D
Dịch vụ nào cung cấp lượng lưu trữ object trực tuyến bền vững gần như không giới hạn?
A. Amazon Redshift.
B. Amazon EFS.
C. Amazon ECS.
D. Amazon S3.
Đáp án đúng: D
Amazon S3 có đặc điểm gì? (Chọn HAI)
A. Một hệ thống file global.
B. Một kho lưu trữ object.
C. Một kho lưu trữ file cục bộ.
D. Một hệ thống file network.
E. Một hệ thống lưu trữ bền vững.
Đáp án đúng: B, E
Dịch vụ nào của AWS có thể lưu trữ một trang web tĩnh?
A. Amazon S3.
B. Amazon Route 53.
C. Amazon QuickSight.
D. AWS X-Ray.
Đáp án đúng: A
Công ty của bạn đang thiết kế một ứng dụng mới sẽ lưu trữ và truy xuất ảnh và video. Dịch vụ nào sau đây bạn nên đề xuất làm cơ chế lưu trữ cơ bản?
A. Amazon EBS.
B. Amazon SQS.
C. Amazon S3.
D. Amazon Instance Store.
Đáp án đúng: C
Để đảm bảo an toàn dữ liệu trên các volume EBS, bạn nên làm gì? (Chọn HAI)
A. Thường xuyên cập nhật firmware trên các thiết bị EBS.
B. Tạo EBS snapshots.
C. Đảm bảo dữ liệu EBS được mã hóa tại rest.
D. Lưu trữ bản sao lưu hàng ngày trong một ổ đĩa ngoài.
E. Ngăn chặn mọi truy cập trái phép vào các trung tâm dữ liệu AWS.
Đáp án đúng: B, C
Dịch vụ lưu trữ nào tiết kiệm chi phí nhất để lưu trữ bản sao lưu cơ sở dữ liệu để truy xuất ngay lập tức?
A. Amazon S3.
B. Amazon Glacier.
C. Amazon EBS.
D. Amazon EC2 Instance Store.
Đáp án đúng: A
Dịch vụ lưu trữ nào của AWS là tốt nhất để lưu trữ dữ liệu sao lưu dài hạn, chi phí thấp?
A. Amazon RDS.
B. Amazon Glacier.
C. AWS Snowball.
D. AWS EBS.
Đáp án đúng: B
Amazon Glacier là một lớp lưu trữ Amazon S3 phù hợp để lưu trữ [...] & [...]. (Chọn HAI)
A. Kho lưu trữ active.
B. Tài sản của trang web động.
C. Dữ liệu phân tích dài hạn.
D. Cơ sở dữ liệu active.
E. Dữ liệu được lưu trong cache.
Đáp án đúng: A, C
Loại lớp lưu trữ S3 nào phù hợp nhất để lưu trữ tài sản tĩnh cho một trang web thương mại điện tử phổ biến với mô hình truy cập ổn định?
A. S3 Standard-IA.
B. S3 Intelligent-Tiering.
C. S3 Glacier Deep Archive.
D. S3 Standard.
Đáp án đúng: D
Những lợi ích nào của Amazon S3 KHÔNG đúng? (Chọn HAI)
A. Amazon S3 cung cấp dung lượng lưu trữ không giới hạn cho bất kỳ loại dữ liệu nào.
B. Amazon S3 có thể chạy bất kỳ loại ứng dụng hoặc hệ thống backend nào.
C. Amazon S3 lưu trữ bất kỳ số lượng object nào, nhưng có giới hạn kích thước object.
D. Amazon S3 có thể được scale thủ công để lưu trữ và truy xuất bất kỳ lượng dữ liệu nào từ bất cứ đâu.
E. Amazon S3 cung cấp độ bền dữ liệu 99.999999999% (11 số 9).
Đáp án đúng: B, D
Số lượng dữ liệu tối đa có thể được lưu trữ trong S3 trong một tài khoản AWS duy nhất là bao nhiêu?
A. 100 PetaByte.
B. Lưu trữ gần như không giới hạn.
C. 5 TeraByte.
D. 10 Exabyte.
Đáp án đúng: B
Các yếu tố nào sau đây sẽ ảnh hưởng đến chi phí bạn phải trả khi lưu trữ object trong S3? (Chọn HAI)
A. Sử dụng mã hóa mặc định cho bất kỳ số lượng S3 bucket nào.
B. Số lượng EBS volume được gắn vào instance của bạn.
C. Lớp lưu trữ được sử dụng cho các object đã lưu trữ.
D. Tạo và xóa S3 bucket.
E. Tổng kích thước tính bằng gigabyte của tất cả các object đã lưu trữ.
Đáp án đúng: C, E
Để bảo vệ dữ liệu được lưu trữ trên Amazon S3 khỏi vô tình xóa, bạn có thể làm gì?
A. Bằng cách bật S3 Versioning.
B. Bằng cách cấu hình S3 Bucket Policies.
C. Bằng cách cấu hình S3 Lifecycle Policies.
D. Bằng cách tắt S3 Cross-Region Replication (CRR).
Đáp án đúng: A
Công ty đã quyết định di chuyển cơ sở dữ liệu Oracle của mình lên AWS. Dịch vụ AWS nào có thể giúp đạt được điều này mà không ảnh hưởng tiêu cực đến chức năng của cơ sở dữ liệu nguồn?
A. AWS OpsWorks.
B. AWS Database Migration Service.
C. AWS Server Migration Service.
D. AWS Application Discovery Service.
Đáp án đúng: B
Dịch vụ nào của AWS cung cấp tính năng sao lưu tự động cho ứng dụng?
A. Cơ sở dữ liệu MySQL được cài đặt trên một instance EC2.
B. Amazon Aurora.
C. Amazon DynamoDB.
D. Amazon Neptune.
Đáp án đúng: B
Dịch vụ managed nào của AWS được sử dụng để lưu trữ cơ sở dữ liệu?
A. AWS Batch.
B. AWS Artifact.
C. AWS Data Pipeline.
D. Amazon RDS.
Đáp án đúng: D
Một khách hàng cần chạy một cơ sở dữ liệu MySQL có khả năng scale dễ dàng. Dịch vụ AWS nào họ nên sử dụng?
A. Amazon Aurora.
B. Amazon Redshift.
C. Amazon DynamoDB.
D. Amazon ElastiCache.
Đáp án đúng: A
Amazon RDS mang lại những lợi ích nào so với quản lý cơ sở dữ liệu truyền thống?
A. AWS quản lý dữ liệu được lưu trữ trong các bảng Amazon RDS.
B. AWS quản lý việc bảo trì hệ điều hành.
C. AWS tự động scale các loại instance theo yêu cầu.
D. AWS quản lý loại cơ sở dữ liệu.
Đáp án đúng: B
Dịch vụ nào tốt nhất để lưu trữ kết quả truy vấn cơ sở dữ liệu phổ biến, giúp giảm tải truy cập cơ sở dữ liệu?
A. Amazon Machine Learning.
B. Amazon SQS.
C. Amazon ElastiCache.
D. Amazon EC2 Instance Store.
Đáp án đúng: C
Dịch vụ nào của AWS là cơ sở dữ liệu NoSQL được quản lý?
A. Amazon Redshift.
B. Amazon DynamoDB.
C. Amazon Aurora.
D. Amazon RDS for MariaDB.
Đáp án đúng: B
Công ty có một lượng lớn dữ liệu có cấu trúc được lưu trữ trong trung tâm dữ liệu on-premises của họ. Họ đang lên kế hoạch di chuyển tất cả dữ liệu sang AWS, tùy chọn cơ sở dữ liệu AWS nào là phù hợp nhất?
A. Amazon DynamoDB.
B. Amazon SNS.
C. Amazon RDS.
D. Amazon ElastiCache.
Đáp án đúng: C
Bạn làm việc với tư cách là DBA MySQL on-premises. Công việc cấu hình cơ sở dữ liệu, sao lưu, vá lỗi và DR có thể tốn thời gian và lặp đi lặp lại. Công ty bạn đã quyết định di chuyển lên AWS Cloud. Điều nào sau đây có thể giúp tiết kiệm thời gian bảo trì cơ sở dữ liệu để bạn có thể tập trung vào kiến trúc và hiệu suất dữ liệu?
A. Amazon RDS.
B. Amazon Redshift.
C. Amazon DynamoDB.
D. Amazon CloudWatch.
Đáp án đúng: A
Dịch vụ nào của AWS có thể chạy cơ sở dữ liệu PostgreSQL được quản lý cung cấp xử lý giao dịch trực tuyến (OLTP)?
A. Amazon DynamoDB.
B. Amazon Athena.
C. Amazon RDS.
D. Amazon EMR.
Đáp án đúng: C
Tính năng nào của Amazon RDS giúp tạo các cơ sở dữ liệu dự phòng trên toàn cầu?
A. Snapshots.
B. Automated patching và updates.
C. Cross-region read replicas.
D. Provisioned IOPS.
Đáp án đúng: C
Tính năng nào của Amazon RDS thực hiện failover tự động khi cơ sở dữ liệu chính không phản hồi?
A. RDS Single-AZ.
B. RDS Write Replica.
C. RDS Snapshots.
D. RDS Multi-AZ.
Đáp án đúng: D
Bạn đang chạy một ứng dụng dịch vụ tài chính trên AWS. Ứng dụng sử dụng cơ sở dữ liệu MySQL để lưu trữ dữ liệu. Dịch vụ AWS nào sau đây sẽ cải thiện hiệu suất ứng dụng của bạn bằng cách cho phép bạn truy xuất thông tin từ bộ nhớ cache nhanh trong memory?
A. Amazon EFS.
B. Amazon Neptune.
C. Amazon ElastiCache.
D. DAX.
Đáp án đúng: C
Công ty của bạn đang thiết kế một ứng dụng mới sẽ lưu trữ và truy xuất ảnh và video. Dịch vụ nào sau đây bạn nên đề xuất làm cơ chế lưu trữ cơ bản?
A. Amazon EBS.
B. Amazon SQS.
C. Amazon S3.
D. Amazon Instance Store.
Đáp án đúng: C
5. ELB, Scaling, Monitor
Công nghệ nào cho phép dung lượng tính toán tự điều chỉnh khi tải thay đổi?
A. Load balancing.
B. Auto failover.
C. Round robin.
D. Auto Scaling.
Đáp án đúng: D
Tính elasticity của AWS Cloud giúp khách hàng tiết kiệm chi phí so với các nhà cung cấp dịch vụ lưu trữ truyền thống. Khách hàng AWS có thể làm gì để hưởng lợi từ tính elasticity của AWS Cloud? (Chọn HAI)
A. Triển khai tài nguyên của bạn trên nhiều Availability Zones.
B. Sử dụng Amazon EC2 Auto Scaling.
C. Triển khai tài nguyên của bạn trong một region khác.
D. Sử dụng Elastic Load Balancing.
E. Sử dụng Serverless Computing bất cứ khi nào có thể.
Đáp án đúng: B, E
Nguyên tắc "thiết kế để chịu lỗi và không có gì sẽ thất bại" rất quan trọng khi thiết kế kiến trúc AWS Cloud của bạn. Điều nào sau đây sẽ giúp tuân thủ nguyên tắc này? (Chọn HAI)
A. Multi-factor authentication.
B. Availability Zones.
C. Elastic Load Balancing.
D. Penetration testing.
E. Vertical scaling.
Đáp án đúng: B, C
Công ty muốn giám sát mức sử dụng CPU của các tài nguyên Amazon EC2 của mình. Dịch vụ AWS nào công ty nên sử dụng?
A. AWS CloudTrail.
B. Amazon CloudWatch.
C. AWS Cost & Usage Report.
D. Amazon SNS.
Đáp án đúng: B
Dịch vụ nào có thể được sử dụng để giám sát và nhận cảnh báo về các sự kiện đăng nhập của user gốc tài khoản AWS vào AWS Management Console?
A. Amazon CloudWatch.
B. AWS Config.
C. AWS Trusted Advisor.
D. AWS IAM.
Đáp án đúng: A
Amazon CloudWatch là gì?
A. Một kho lưu trữ code với các tính năng build và commit group có thể tùy chỉnh.
B. Một kho lưu trữ metrics với ngưỡng thông báo và kênh có thể tùy chỉnh.
C. Một kho lưu trữ cấu hình bảo mật với phân tích mối đe dọa.
D. Một kho lưu trữ quy tắc của web application firewall với các tính năng ngăn chặn lỗ hổng tự động.
Đáp án đúng: B
Dịch vụ nào của AWS thu thập metrics từ các instance EC2 đang chạy?
A. Amazon Inspector.
B. Amazon CloudWatch.
C. AWS CloudFormation.
D. AWS CloudTrail.
Đáp án đúng: B
Dịch vụ nào sau đây có thể được sử dụng để giám sát các yêu cầu HTTP và HTTPS được chuyển tiếp đến Amazon CloudFront?
A. AWS WAF.
B. Amazon CloudWatch.
C. AWS Cloud9.
D. AWS CloudTrail.
Đáp án đúng: B
Bạn đang làm việc với tư cách là Site Reliability Engineer (SRE) trong một môi trường AWS, dịch vụ nào sau đây giúp giám sát các ứng dụng của bạn?
A. Amazon CloudWatch.
B. Amazon CloudSearch.
C. Amazon Elastic MapReduce.
D. Amazon CloudHSM.
Đáp án đúng: A
Dịch vụ nào của AWS cung cấp khả năng tự động thêm hoặc xóa các instance Amazon EC2 dựa trên nhu cầu?
A. Elastic Load Balancer.
B. Amazon EC2 Auto Scaling.
C. Amazon Route 53.
D. Amazon CloudFront.
Đáp án đúng: B
Dịch vụ nào của AWS có thể được sử dụng để tự động scale ứng dụng lên và xuống mà không cần đưa ra quyết định lập kế hoạch dung lượng?
A. Amazon AutoScaling.
B. Amazon Redshift.
C. AWS CloudTrail.
D. AWS Lambda.
Đáp án đúng: A
6. Hạ tầng toàn cầu (Region, AZ, Edge Locations) và Mô hình chia sẻ trách nhiệm
Thành phần nào sau đây của cơ sở hạ tầng global của AWS bao gồm một hoặc nhiều trung tâm dữ liệu riêng biệt được kết nối thông qua các liên kết có độ trễ thấp?
A. Availability Zone.
B. Edge location.
C. Region.
D. Private network.
Đáp án đúng: A
Đâu là một đặc điểm của Edge Locations?
A. Lưu trữ các instance Amazon EC2 gần user hơn.
B. Giúp giảm độ trễ và cải thiện hiệu suất cho user.
C. Lưu trữ dữ liệu thay đổi thường xuyên mà không cần đến máy chủ gốc.
D. Làm mới dữ liệu thay đổi hàng ngày.
Đáp án đúng: B
Tính năng nào của AWS Cloud sẽ hỗ trợ yêu cầu về độ trễ thấp cho tất cả khách hàng của một công ty quốc tế?
A. Fault tolerance.
B. Global reach.
C. Pay-as-you-go pricing.
D. High availability.
Đáp án đúng: B
Đâu là một mối quan hệ đúng giữa Region, Availability Zone và Edge Location?
A. Các trung tâm dữ liệu chứa các Region.
B. Các Region chứa các Availability Zone.
C. Các Availability Zone chứa các Edge Location.
D. Các Edge Location chứa các Region.
Đáp án đúng: B
Làm thế nào để user bảo vệ khỏi sự gián đoạn dịch vụ của AWS nếu một thảm họa tự nhiên ảnh hưởng đến toàn bộ khu vực địa lý?
A. Triển khai ứng dụng trên nhiều Availability Zones trong một Region AWS.
B. Sử dụng mô hình triển khai hybrid cloud trong khu vực địa lý.
C. Triển khai ứng dụng trên nhiều Region AWS.
D. Lưu trữ các component ứng dụng bằng AWS Artifact và sao chép chúng trên nhiều Region AWS.
Đáp án đúng: C
Một công ty đang có kế hoạch khởi chạy một trang web thương mại điện tử ở một Region AWS duy nhất cho user trên toàn thế giới. Các dịch vụ AWS nào sẽ cho phép công ty tiếp cận user và cung cấp độ trễ thấp và tốc độ truyền tải cao? (Chọn HAI)
A. Application Load Balancer.
B. AWS Global Accelerator.
C. AWS Direct Connect.
D. Amazon CloudFront.
E. AWS Lambda.
Đáp án đúng: B, D
Làm thế nào để một công ty cung cấp trải nghiệm độ trễ thấp hơn cho user của mình trên toàn cầu?
A. Sử dụng một Region AWS trung tâm cho tất cả user.
B. Sử dụng Availability Zone thứ hai trong Region AWS đang sử dụng.
C. Bật caching trong Region AWS đang sử dụng.
D. Sử dụng Edge Locations để đặt nội dung gần user hơn.
Đáp án đúng: D
Các lợi ích của việc sử dụng AWS Cloud cho các công ty có khách hàng ở nhiều quốc gia trên thế giới là gì? (Chọn HAI)
A. Các công ty có thể triển khai ứng dụng ở nhiều Region AWS để giảm độ trễ.
B. Amazon Translate tự động dịch giao diện trang web của bên thứ ba sang nhiều ngôn ngữ.
C. Amazon CloudFront có nhiều Edge Locations trên khắp thế giới để giảm độ trễ.
D. Amazon Comprehend cho phép user xây dựng các ứng dụng có thể phản hồi yêu cầu của user bằng nhiều ngôn ngữ.
E. Elastic Load Balancing có thể phân phối lưu lượng truy cập web của ứng dụng đến nhiều Region AWS trên khắp thế giới, giúp giảm độ trễ.
Đáp án đúng: A, C
Availability Zone trong AWS là gì?
A. Một hoặc nhiều trung tâm dữ liệu vật lý.
B. Một vị trí địa lý hoàn toàn biệt lập.
C. Một hoặc nhiều Edge Location phân tán trên khắp thế giới.
D. Một vị trí trung tâm dữ liệu với một nguồn điện và network duy nhất.
Đáp án đúng: A
Tại sao mỗi Region AWS lại chứa nhiều Availability Zones?
A. Nhiều Availability Zones cho phép bạn xây dựng các kiến trúc kiên cường và có tính high availability.
B. Nhiều Availability Zones dẫn đến tổng chi phí thấp hơn so với việc triển khai trong một Availability Zone duy nhất.
C. Nhiều Availability Zones trong một region cho phép sao chép dữ liệu và global reach.
D. Nhiều Availability Zones trong một region làm tăng dung lượng lưu trữ có sẵn trong region đó.
Đáp án đúng: A
Thành phần nào của cơ sở hạ tầng global của AWS được sử dụng để lưu trữ bản sao nội dung để phân phối nhanh hơn cho user trên toàn cầu?
A. AWS Regions.
B. Availability Zones.
C. Edge locations.
D. Data centers.
Đáp án đúng: C
Một công ty có ứng dụng với user ở cả Úc và Brazil. Tất cả cơ sở hạ tầng của công ty hiện được cấp phát ở Region Asia Pacific (Sydney) ở Úc, và user Brazil đang trải nghiệm độ trễ cao. Công ty nên làm gì để giảm độ trễ?
A. Triển khai AWS Direct Connect cho user ở Brazil.
B. Cấp phát tài nguyên ở Region South America (São Paulo) ở Brazil.
C. Sử dụng AWS Transit Gateway để nhanh chóng định tuyến user từ Brazil đến ứng dụng.
D. Khởi chạy các instance Amazon EC2 bổ sung ở Sydney để xử lý nhu cầu.
Đáp án đúng: B
Phát biểu nào đúng về Shared Responsibility Model của AWS?
A. Trách nhiệm thay đổi tùy thuộc vào các dịch vụ được sử dụng.
B. Bảo mật của các dịch vụ IaaS là trách nhiệm của AWS.
C. Vá lỗi hệ điều hành guest luôn là trách nhiệm của AWS.
D. Bảo mật của các managed service là trách nhiệm của khách hàng.
Đáp án đúng: A
Theo Shared Responsibility Model của AWS, nhiệm vụ nào sau đây là trách nhiệm của khách hàng? (Chọn HAI)
A. Đảm bảo rằng các thiết bị ổ đĩa được xóa sạch sau khi sử dụng.
B. Đảm bảo rằng firmware được cập nhật trên các thiết bị phần cứng.
C. Đảm bảo rằng dữ liệu được mã hóa tại rest.
D. Đảm bảo rằng cáp network là loại sáu trở lên.
E. Đặt quy tắc độ phức tạp password.
Đáp án đúng: C, E
Theo Shared Responsibility Model của AWS, trách nhiệm nào sau đây là của AWS?
A. Client-side data encryption.
B. Cấu hình thiết bị hạ tầng.
C. Server-side data encryption.
D. Lọc lưu lượng bằng Security Groups.
Đáp án đúng: B
Đâu là ví dụ về shared controls của AWS? (Chọn HAI)
A. Patch Management.
B. IAM Management.
C. VPC Management.
D. Configuration Management.
E. Data center operations.
Đáp án đúng: A, D
Dưới Shared Responsibility Model, hành động nào sau đây do user chịu hoàn toàn trách nhiệm khi chạy khối lượng công việc trên AWS?
A. Vá lỗi các component hạ tầng.
B. Duy trì các component hạ tầng cơ bản.
C. Duy trì các kiểm soát vật lý và môi trường.
D. Triển khai các kiểm soát để định tuyến lưu lượng ứng dụng.
Đáp án đúng: D
Theo Shared Responsibility Model của AWS, ai chịu trách nhiệm về bảo mật và tuân thủ?
A. Khách hàng chịu trách nhiệm.
B. AWS chịu trách nhiệm.
C. AWS và khách hàng cùng chia sẻ trách nhiệm.
D. AWS chia sẻ trách nhiệm với cơ quan quản lý liên quan.
Đáp án đúng: C
Dưới Shared Responsibility Model của AWS, kiểm soát vận hành nào sau đây user hoàn toàn kế thừa từ AWS?
A. Data center security management.
B. Patch Management.
C. Configuration Management.
D. User and access management.
Đáp án đúng: D
Dưới Shared Responsibility Model của AWS, điều nào sau đây là ví dụ về bảo mật trong AWS Cloud?
A. Edge location management.
B. Physical security.
C. Firewall configuration.
D. Global infrastructure.
Đáp án đúng: C
Dưới Shared Responsibility Model của AWS, điều nào sau đây là trách nhiệm duy nhất của AWS?
A. Application security.
B. Edge location management.
C. Patch Management.
D. Client-side data.
Đáp án đúng: B
Theo Shared Responsibility Model của AWS, ai chịu trách nhiệm về configuration management?
A. Hoàn toàn là trách nhiệm của khách hàng.
B. Hoàn toàn là trách nhiệm của AWS.
C. Được chia sẻ giữa AWS và khách hàng.
D. Không phải là một phần của Shared Responsibility Model của AWS.
Đáp án đúng: C
Theo Shared Responsibility Model của AWS, ai chịu trách nhiệm vá hệ điều hành guest?
A. AWS Product Team.
B. Khách hàng.
C. Managed partners.
D. AWS Support.
Đáp án đúng: B
Theo Shared Responsibility Model của AWS, nhiệm vụ nào sau đây là trách nhiệm của khách hàng?
A. Vá lỗi hệ điều hành guest và ứng dụng.
B. Vá lỗi và khắc phục các lỗi trong cơ sở hạ tầng.
C. Kiểm soát vật lý và môi trường.
D. Cấu hình các thiết bị hạ tầng AWS.
Đáp án đúng: A
Trong Shared Responsibility Model, ai chịu trách nhiệm bảo mật và vá lỗi hệ điều hành guest?
A. AWS Support.
B. Khách hàng.
C. AWS Systems Manager.
D. AWS Config.
Đáp án đúng: B
7. Migrating System lên AWS và Multi-account Strategy
Công ty đã quyết định di chuyển cơ sở dữ liệu Oracle của mình lên AWS. Dịch vụ AWS nào có thể giúp đạt được điều này mà không ảnh hưởng tiêu cực đến chức năng của cơ sở dữ liệu nguồn?
A. AWS OpsWorks.
B. AWS Database Migration Service.
C. AWS Server Migration Service.
D. AWS Application Discovery Service.
Đáp án đúng: B
Công cụ nào có thể hỗ trợ đánh giá một ứng dụng để di chuyển lên cloud? (Chọn HAI)
A. AWS Trusted Advisor.
B. AWS Professional Services.
C. AWS Systems Manager.
D. AWS Partner Network (APN).
E. AWS Secrets Manager.
Đáp án đúng: B, D`;

  const sampleUnformattedText = `Tính đàn hồi của AWS Cloud giúp khách hàng tiết kiệm chi phí so với các nhà cung cấp dịch vụ lưu trữ truyền thống. Khách hàng AWS có thể làm gì để hưởng lợi từ tính đàn hồi của AWS Cloud? (Chọn HAI)
Triển khai tài nguyên của bạn trên nhiều Vùng sẵn sàng.
Sử dụng Amazon EC2 Auto Scaling.
Triển khai tài nguyên của bạn trong một khu vực khác.
Sử dụng cân bằng tải Elastic.
Sử dụng Điện toán phi máy chủ (Serverless Computing) bất cứ khi nào có thể.
câu đúng: 2, 5`;

  return (
    <div className="quiz-input">
      <h2>Tạo Quiz từ Text</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mode-selection">
          <label>Chọn chế độ làm quiz:</label>
          <div className="mode-options">
            <label className="mode-option">
              <input
                type="radio"
                name="mode"
                value="test"
                checked={selectedMode === 'test'}
                onChange={(e) => setSelectedMode(e.target.value as QuizMode)}
              />
              <span className="mode-text">
                <strong>Kiểm tra</strong>
                {/* <small>Hiển thị kết quả sau khi hoàn thành tất cả câu hỏi</small> */}
              </span>
            </label>
            <label className="mode-option">
              <input
                type="radio"
                name="mode"
                value="practice"
                checked={selectedMode === 'practice'}
                onChange={(e) => setSelectedMode(e.target.value as QuizMode)}
              />
              <span className="mode-text">
                <strong>Ôn tập</strong>
                {/* <small>Hiển thị đáp án ngay sau mỗi câu hỏi</small> */}
              </span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="quiz-text">
            Nhập câu hỏi theo format (mỗi câu hỏi có các lựa chọn A, B, C... và "Đáp án đúng: X"):
            <br />
            {/* <small>💡 Có thể dùng tính năng "Format Text" để tự động format text chưa chuẩn bằng AI</small> */}
          </label>
          <textarea
            id="quiz-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ví dụ text đã chuẩn format:\n\n${sampleText}`}
            rows={15}
            cols={80}
            required
          />
        </div>
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => setInputText(sampleText)}
            className="sample-btn"
            disabled={isFormatting || isLoading}
          >
            Ví dụ chuẩn
          </button>
          {/* <button 
            type="button" 
            onClick={() => setInputText(sampleUnformattedText)}
            className="sample-btn demo-unformatted"
            disabled={isFormatting || isLoading}
          >
            Ví dụ chưa chuẩn
          </button> */}
          <button 
            type="button"
            onClick={handleFormatText}
            disabled={isFormatting || isLoading || !inputText.trim()}
            className="format-btn"
          >
            {isFormatting ? 'Đang format...' : 'Format Text'}
          </button>
          <button 
            type="submit" 
            disabled={isLoading || isFormatting || !inputText.trim()}
            className="create-btn"
          >
            {isLoading ? 'Đang tạo quiz...' : 'Tạo Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizInput; 