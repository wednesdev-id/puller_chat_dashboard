import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWhatsAppSession } from '@/hooks/useWhatsApp';
import {
  ExternalLink,
  WifiOff,
  CheckCircle,
  Loader2,
  Smartphone,
} from 'lucide-react';

const WhatsAppConnection = () => {
  const {
    sessions,
    connectionStatus,
    isLoading,
    isDisconnecting,
    startWhatsApp,
    autoSetupWhatsApp,
    disconnectSession,
    openDashboard,
  } = useWhatsAppSession();

  const activeSession = sessions[0];

  const handleAutoSetup = () => {
    autoSetupWhatsApp();
  };

  const handleStartConnection = () => {
    startWhatsApp();
  };

  const handleDisconnect = () => {
    if (activeSession) {
      disconnectSession(activeSession.id);
    }
  };

  const handleOpenDashboard = () => {
    openDashboard();
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'connecting':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-600" />;
      case 'disconnected':
        return <WifiOff className="w-6 h-6 text-red-600" />;
      default:
        return <WifiOff className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Not Connected';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'default';
      case 'connecting':
        return 'secondary';
      case 'disconnected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-3 sm:p-4 min-h-screen flex flex-col justify-center py-8">
      <Card className="rounded-lg border bg-card text-card-foreground w-full shadow-lg">
        <CardHeader className="text-center pb-3 space-y-2">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Smartphone className="w-5 h-5" />
            WhatsApp Connection
          </CardTitle>
          <div className="flex items-center justify-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusBadgeVariant()} className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {connectionStatus === 'connected' && activeSession ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-green-900">Successfully Connected!</h3>
                <p className="text-sm text-green-700">
                  Your WhatsApp is now connected and ready to use.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  Session ID: <code className="bg-gray-100 px-2 py-1 rounded">{activeSession.id}</code>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleOpenDashboard}
                  className="text-sm"
                  disabled={isLoading}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="text-sm"
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 mr-2" />
                      Disconnect
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : connectionStatus === 'connecting' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900">Auto-setting up connection...</h3>
                <p className="text-sm text-blue-700">
                  API key configured and QR code ready for scanning
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-left text-xs text-blue-800">
                  <p className="font-medium mb-2">Auto-Setup Progress:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✓ API Key configured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✓ Session created/loaded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>⏳ Waiting for QR scan...</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleOpenDashboard}
                className="w-full"
                variant="outline"
                disabled={isLoading}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open WAHA Dashboard
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-gray-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Connect to WhatsApp</h3>
                <p className="text-sm text-gray-600">
                  Auto-setup API key and QR code in one click
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleAutoSetup}
                  disabled={isLoading}
                  className="text-sm w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Auto-Setting Up...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Auto-Setup & Connect
                    </>
                  )}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleStartConnection}
                    variant="outline"
                    disabled={isLoading}
                    className="text-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 mr-2" />
                        Manual
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleOpenDashboard}
                    variant="outline"
                    className="text-sm"
                    disabled={isLoading}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}

          </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppConnection;