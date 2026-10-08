import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Typed HTTP error (mirrors the TanStack `error.message` surface).
class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});
  final String message;
  final int? statusCode;

  @override
  String toString() => 'ApiException($statusCode): $message';
}

/// One Dio instance per API host: isolates the heavy CDN/audio path from
/// JSON, and allows per-host timeouts. JSON reads use 15s timeouts.
Dio _buildClient(String baseUrl) {
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: const {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ),
  );
  dio.interceptors.add(
    InterceptorsWrapper(
      onError: (e, handler) {
        final code = e.response?.statusCode;
        handler.reject(
          DioException(
            requestOptions: e.requestOptions,
            response: e.response,
            type: e.type,
            error: ApiException(
              e.response?.statusMessage ?? 'Network error',
              statusCode: code,
            ),
          ),
        );
      },
    ),
  );
  return dio;
}

abstract final class ApiClients {
  static final equran = _buildClient('https://equran.id/api/');
  static final doa = _buildClient('https://open-api.my.id/api/');
  static final muslim = _buildClient('https://muslim-api-three.vercel.app/v1/');
  static final asmaul = _buildClient(
    'https://asmaul-husna-api.vercel.app/api/',
  );
}

/// GET a plain body and parse it on a background isolate so large Arabic
/// payloads never block the UI thread.
Future<T> getAndParse<T>(
  Dio client,
  String path,
  T Function(String raw) parse, {
  Map<String, dynamic>? query,
  dynamic body,
  bool post = false,
}) async {
  try {
    final res = post
        ? await client.post<dynamic>(
            path,
            data: body,
            options: Options(responseType: ResponseType.plain),
          )
        : await client.get<dynamic>(
            path,
            queryParameters: query,
            options: Options(responseType: ResponseType.plain),
          );
    final code = res.statusCode ?? 0;
    if (code < 200 || code >= 300) {
      throw ApiException('HTTP $code', statusCode: code);
    }
    final parsed = await compute(parse, res.data as String);
    return parsed;
  } on DioException catch (e) {
    if (e.error is ApiException) throw e.error!;
    throw ApiException(e.message ?? 'Network error');
  }
}
