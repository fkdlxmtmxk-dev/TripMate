
import { useLocation, useNavigate } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();
    const navigate = useNavigate();

    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">

                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-slate-300">
                            404
                        </h1>
                        <div className="h-0.5 w-16 bg-slate-200 mx-auto" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-slate-800">
                            페이지를 찾을 수 없습니다.
                        </h2>

                        <p className="text-slate-600 leading-relaxed">
                            요청하신 페이지
                            <span className="font-medium text-slate-700">
                                {' '}"{pageName}"{' '}
                            </span>
                            를 찾을 수 없습니다.
                        </p>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
